const { PrismaClient } = require('@prisma/client');
const scannerService = require('../services/scanner.service');

const prisma = new PrismaClient();

const submitScan = async (req, res) => {
  const { targetUrl } = req.body;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Target URL is required' });
  }

  // 1. Validate URL & SSRF Check
  const validation = scannerService.validateUrl(targetUrl);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const cleanUrl = validation.url;

  try {
    // 2. Create Initial Scan Record
    // NOTE: In Phase 1 we don't have auth, so we'll use a hardcoded user or just allow null userId if schema allows.
    // However, our schema requires userId. For Phase 1 demo, we'll auto-create or use a 'guest' user.
    let guestUser = await prisma.user.findUnique({ where: { username: 'guest' } });
    if (!guestUser) {
      guestUser = await prisma.user.create({
        data: {
          username: 'guest',
          email: 'guest@octaguard.local',
          password: 'nopassword' // In real app, this would be hashed
        }
      });
    }

    const scan = await prisma.scan.create({
      data: {
        userId: guestUser.id,
        targetUrl: cleanUrl,
        status: 'running',
      }
    });

    // 3. Perform Scan Synchronously
    const results = await scannerService.performScan(cleanUrl);

    if (results.success) {
      // 4. Save Findings
      if (results.findings.length > 0) {
        await prisma.vulnerability.createMany({
          data: results.findings.map(f => ({
            scanId: scan.id,
            name: f.name,
            risk: f.risk,
            description: f.description,
            url: f.url,
            solution: f.solution
          }))
        });
      }

      // 5. Update Scan Status
      const updatedScan = await prisma.scan.update({
        where: { id: scan.id },
        data: {
          status: 'completed',
          riskScore: results.riskScore
        },
        include: { vulnerabilities: true }
      });

      return res.json(updatedScan);
    } else {
      await prisma.scan.update({
        where: { id: scan.id },
        data: { status: 'failed' }
      });
      return res.status(500).json({ error: results.error || 'Scan failed' });
    }

  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Internal server error during scan' });
  }
};

const getScans = async (req, res) => {
  try {
    const scans = await prisma.scan.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { vulnerabilities: true } } }
    });
    res.json(scans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scans' });
  }
};

const getScanDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const scan = await prisma.scan.findUnique({
      where: { id },
      include: { vulnerabilities: true }
    });
    if (!scan) return res.status(404).json({ error: 'Scan not found' });
    res.json(scan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scan details' });
  }
};

module.exports = {
  submitScan,
  getScans,
  getScanDetails
};

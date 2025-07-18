export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial connection message
  res.write('data: {"type":"connected"}\n\n');

  // Function to send updates
  const sendUpdate = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Store the connection in global connections pool
  if (!global.connections) {
    global.connections = new Set();
  }
  global.connections.add(sendUpdate);

  // Remove connection when client disconnects
  req.on('close', () => {
    global.connections.delete(sendUpdate);
  });
} 
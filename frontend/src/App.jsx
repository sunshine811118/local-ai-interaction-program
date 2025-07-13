import React, { useState } from 'react';
import { Box, Button, TextField, Paper, Typography, LinearProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import UploadIcon from '@mui/icons-material/Upload';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/query', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      setResponses([...responses, { user: prompt, ai: data.response }]);
      setPrompt('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>本地AI交互程序</Typography>
      <Paper sx={{ height: 500, overflow: 'auto', p: 2, mb: 2 }}>
        {responses.map((msg, idx) => (
          <Box key={idx} mb={2}>
            <Typography variant="subtitle1"><strong>用户:</strong> {msg.user}</Typography>
            <Typography variant="body1"><strong>AI:</strong> {msg.ai}</Typography>
          </Box>
        ))}
      </Paper>
      <Box display="flex" gap={2}>
        <TextField
          fullWidth
          variant="outlined"
          label="输入你的问题..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={<SendIcon />}
        >
          发送
        </Button>
        <Button
          variant="outlined"
          startIcon={<UploadIcon />}
        >
          上传文件
        </Button>
      </Box>
      {loading && <LinearProgress sx={{ mt: 2 }} />}
    </Box>
  );
};

export default App;

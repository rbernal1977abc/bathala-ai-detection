from http.server import BaseHTTPRequestHandler
import json
import random
from datetime import datetime
import cgi

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Parse form data
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={'REQUEST_METHOD': 'POST'}
        )
        
        # Simulate AI analysis
        confidence = random.uniform(80, 99.99)
        is_ai = random.random() > 0.5
        
        result = {
            "status": "success",
            "report_id": datetime.now().strftime("%Y%m%d%H%M%S"),
            "confidence": confidence,
            "isAI": is_ai,
            "analysis": {
                "ai_probability": random.uniform(70, 100),
                "edited_areas": random.uniform(0, 15)
            },
            "metadata": {
                "camera": "Canon EOS R5",
                "lens": "RF 24-70mm f/2.8L",
                "gps": "14.5995° N, 120.9842° E",
                "timestamp": datetime.now().isoformat(),
                "software": ["Photoshop", "Lightroom"]
            }
        }
        
        self.wfile.write(json.dumps(result).encode())

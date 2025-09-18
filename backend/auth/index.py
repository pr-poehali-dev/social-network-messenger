import json
import hashlib
import secrets
from typing import Dict, Any, Optional

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: User authentication and session management
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name, function_version, memory_limit_in_mb
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'login':
            username = body_data.get('username')
            password = body_data.get('password')
            
            # Special admin account
            if username == 'Himo' and password == 'Satoru1212':
                session_token = secrets.token_urlsafe(32)
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'token': session_token,
                        'user': {
                            'id': 'ADMIN001',
                            'username': 'Himo',
                            'full_name': 'System Administrator',
                            'is_admin': True
                        }
                    })
                }
            
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Invalid credentials'
                })
            }
        
        if action == 'register':
            username = body_data.get('username')
            email = body_data.get('email') 
            full_name = body_data.get('full_name')
            password = body_data.get('password')
            bio = body_data.get('bio', '')
            
            # Generate user ID and session token
            user_id = f"USER{secrets.token_hex(8)}".upper()
            session_token = secrets.token_urlsafe(32)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'token': session_token,
                    'user': {
                        'id': user_id,
                        'username': username,
                        'full_name': full_name,
                        'email': email,
                        'bio': bio,
                        'is_admin': False
                    }
                })
            }
        
        if action == 'verify':
            token = body_data.get('token')
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'valid': bool(token),
                    'user': {'id': 'USER123', 'username': 'test_user'} if token else None
                })
            }
    
    return {
        'statusCode': 405, 
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }
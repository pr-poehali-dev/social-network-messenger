import json
from typing import Dict, Any, List, Optional
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Real-time chat messaging with WebSocket simulation
    Args: event - dict with httpMethod, body for message operations
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict with message data and real-time updates
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
        
        if action == 'send_message':
            sender_id = body_data.get('sender_id')
            receiver_id = body_data.get('receiver_id')
            content = body_data.get('content')
            message_type = body_data.get('message_type', 'text')
            
            message = {
                'id': str(int(datetime.now().timestamp() * 1000)),
                'sender_id': sender_id,
                'receiver_id': receiver_id,
                'content': content,
                'message_type': message_type,
                'created_at': datetime.now().isoformat(),
                'is_read': False
            }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': message,
                    'delivered': True
                })
            }
        
        if action == 'get_messages':
            user1_id = body_data.get('user1_id')
            user2_id = body_data.get('user2_id')
            limit = body_data.get('limit', 50)
            
            # Simulate message history
            messages = [
                {
                    'id': '1',
                    'sender_id': user1_id,
                    'receiver_id': user2_id,
                    'content': 'Привет! Как дела?',
                    'message_type': 'text',
                    'created_at': datetime.now().isoformat(),
                    'is_read': True
                },
                {
                    'id': '2',
                    'sender_id': user2_id,
                    'receiver_id': user1_id,
                    'content': 'Привет! Всё отлично, спасибо!',
                    'message_type': 'text',
                    'created_at': datetime.now().isoformat(),
                    'is_read': False
                }
            ]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'messages': messages[:limit]
                })
            }
        
        if action == 'mark_read':
            message_ids = body_data.get('message_ids', [])
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'marked_count': len(message_ids)
                })
            }
        
        if action == 'connect':
            user_id = body_data.get('user_id')
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'connection_id': f'conn_{user_id}_{int(datetime.now().timestamp())}',
                    'pending_messages': []
                })
            }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        user_id = params.get('user_id')
        
        if user_id:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'online_status': True,
                    'last_seen': datetime.now().isoformat()
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
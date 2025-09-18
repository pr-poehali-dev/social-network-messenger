import json
from typing import Dict, Any, List, Optional
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Admin panel for user management and moderation  
    Args: event - dict with httpMethod, body for admin operations
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict with admin data and moderation actions
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
    
    def verify_admin_token(token: str) -> bool:
        # In real app would verify against database
        return token and len(token) > 10
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'ban_user':
            admin_token = body_data.get('admin_token')
            target_user_id = body_data.get('target_user_id')
            reason = body_data.get('reason')
            duration = body_data.get('duration')
            
            if not verify_admin_token(admin_token):
                return {
                    'statusCode': 403,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': False,
                        'error': 'Unauthorized admin access'
                    })
                }
            
            banned_until = None
            if duration:
                banned_until = datetime.fromtimestamp(
                    datetime.now().timestamp() + duration
                ).isoformat()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'action': 'user_banned',
                    'target_user_id': target_user_id,
                    'reason': reason,
                    'banned_until': banned_until
                })
            }
        
        if action == 'unban_user':
            admin_token = body_data.get('admin_token')
            target_user_id = body_data.get('target_user_id')
            
            if not verify_admin_token(admin_token):
                return {
                    'statusCode': 403,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': False,
                        'error': 'Unauthorized admin access'
                    })
                }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'action': 'user_unbanned',
                    'target_user_id': target_user_id
                })
            }
        
        if action == 'read_messages':
            admin_token = body_data.get('admin_token')
            user1_id = body_data.get('user1_id')
            user2_id = body_data.get('user2_id')
            
            if not verify_admin_token(admin_token):
                return {
                    'statusCode': 403,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': False,
                        'error': 'Unauthorized admin access'
                    })
                }
            
            # Simulate reading private messages
            messages = [
                {
                    'id': '1',
                    'sender_id': user1_id,
                    'receiver_id': user2_id,
                    'content': 'Частное сообщение 1',
                    'created_at': datetime.now().isoformat(),
                    'is_read': True
                },
                {
                    'id': '2', 
                    'sender_id': user2_id,
                    'receiver_id': user1_id,
                    'content': 'Частное сообщение 2',
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
                    'messages': messages,
                    'accessed_by': 'admin',
                    'access_time': datetime.now().isoformat()
                })
            }
        
        if action == 'get_users':
            admin_token = body_data.get('admin_token')
            
            if not verify_admin_token(admin_token):
                return {
                    'statusCode': 403,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': False,
                        'error': 'Unauthorized admin access'
                    })
                }
            
            users = [
                {
                    'id': 'USER123',
                    'username': 'alex_petrov', 
                    'email': 'alex@example.com',
                    'full_name': 'Алексей Петров',
                    'is_online': True,
                    'is_banned': False,
                    'created_at': '2023-01-15T10:30:00Z'
                },
                {
                    'id': 'USER456',
                    'username': 'maria_ivanova',
                    'email': 'maria@example.com',
                    'full_name': 'Мария Иванова',
                    'is_online': False,
                    'is_banned': False,
                    'created_at': '2023-02-01T14:20:00Z'
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
                    'users': users,
                    'total': len(users)
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
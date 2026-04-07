from .models import AuditLog

class RequestAuditMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.method in {'POST', 'PATCH', 'PUT', 'DELETE'} and getattr(request, 'user', None) and request.user.is_authenticated:
            AuditLog.objects.create(
                actor_user=request.user,
                entity_type='http_request',
                entity_id=request.path,
                action=request.method,
                after_data={'status_code': response.status_code},
                ip_address=self._get_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
            )
        return response

    def _get_ip(self, request):
        return request.META.get('REMOTE_ADDR')

# config/settings/dev.py
from .base import *

# ✅ Development режим
DEBUG = env.bool('DEBUG', default=True)

# ✅ Разрешаем все хосты для разработки
ALLOWED_HOSTS += ['*']

# ✅ Console email backend (письма не отправляются, вывод в консоль)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# ✅ Django Debug Toolbar
# INSTALLED_APPS += [
#     'debug_toolbar',
# ]

# MIDDLEWARE += [
#     'debug_toolbar.middleware.DebugToolbarMiddleware',
# ]

INTERNAL_IPS = ['127.0.0.1']



# ✅ CORS для разработки
CORS_ALLOW_ALL_ORIGINS = True

# ✅ Простая аутентификация для API браузера
REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] += [
    'rest_framework.authentication.SessionAuthentication',
]
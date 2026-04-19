import os

ENVIRONMENT = os.environ.get('DJANGO_SETTINGS_MODULE', 'itsm.settings.local')


if 'prod' in ENVIRONMENT:
    from .prod import *
elif 'dev' in ENVIRONMENT:
    from .dev import *
elif 'local' in ENVIRONMENT:
    from .local import *
    
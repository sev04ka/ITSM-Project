from django.urls import include, path
from rest_framework import routers
from django.contrib import admin


from .apps.cmdb.views import ConfigurationItemViewSet
from .apps.cmdb.views import CITypeViewSet
from .apps.tickets.views import TicketViewSet, CommentViewSet
from .apps.users.views.user import UserViewSet


router = routers.DefaultRouter()
router.register(r"conf-items", ConfigurationItemViewSet)
router.register(r"ci-type", CITypeViewSet)
router.register(r"tickets", TicketViewSet)
router.register(r"comments", CommentViewSet)
router.register(r"users", UserViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("api/", include(router.urls)),
    path('admin/', admin.site.urls),
    path('api/auth/', include('dj_rest_auth.urls')),
]



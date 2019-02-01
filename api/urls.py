# Django imports
from django.conf.urls import url, include

# Project imports
from .views import *

urlpatterns = [
    url(r'^waypoint', WaypointCorrectedView.as_view()),
]

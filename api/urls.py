# Django imports
from django.conf.urls import url, include

# Project imports
from .views import *

urlpatterns = [
    url(r'^', WaypointCorrectedView.as_view()),
]

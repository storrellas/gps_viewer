from django.shortcuts import render
from django.http import HttpResponse
from django.views import View

from gps_viewer import utils

logger = utils.get_logger()

class WaypointCorrectedView(View):
    def post(self, request):
        # PLACE YOUR CODE HERE
        logger.info("This is my view") 
        return HttpResponse({'result': 234})

# Create your views here.

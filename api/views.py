import json

# Django import
from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from django.http import JsonResponse

# Project import
from gps_viewer import utils

logger = utils.get_logger()

class WaypointCorrectedView(View):
    def post(self, request):

        # Decode body
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        # PLACE YOUR CODE HERE
        logger.info("Generating corrected waypoint list")
        waypoint_corrected_list = []
        for waypoint in body['waypoint']:
            waypoint_corrected = waypoint
            waypoint_corrected[0] = waypoint_corrected[0] - 0.02
            waypoint_corrected_list.append(waypoint_corrected)

        # Generate response
        return JsonResponse({'waypoint_corrected': waypoint_corrected_list})

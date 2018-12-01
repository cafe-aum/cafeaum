# -*- coding: utf-8 -*-
from rest_framework import views, status

from rest_framework.response import Response
from .models import Evenement, Exposition
from .serializers import EvenementSerializer, ExpositionSerializer


class EvenementView(views.APIView):
    serializer_class = EvenementSerializer

    def get(self, request, format=None):
        evenements = Evenement.objects.all()
        serialized_evenements = EvenementSerializer(evenements, many=True)
        print(" evenement : %s"%serialized_evenements.data)
        return Response(serialized_evenements.data)


class ExpositionView(views.APIView):

    def get(self, request, format=None):
        expo = Exposition.objects.all()
        serialized_expo = ExpositionSerializer(expo, many=True)
        return Response(serialized_expo.data)

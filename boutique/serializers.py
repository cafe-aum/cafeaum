# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import Createur


class CreateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Createur
        fields = ('id', 'nom', 'texte', 'image')



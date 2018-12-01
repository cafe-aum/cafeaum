# -*- coding: utf-8 -*-
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils.encoding import python_2_unicode_compatible


class Createur(models.Model):
    nom = models.CharField(max_length=60)
    texte = models.TextField()
    texte2 = models.TextField()
    texte3 = models.TextField()
    texte4 = models.TextField()
    image = models.CharField(max_length=128, default='/static/img/...')

    def __str__(self):
        return ' | '.join([self.nom, self.texte[0:10] + "..."])

    def __unicode__(self):
        return ' | '.join([self.nom, self.texte[0:10] + "..."])


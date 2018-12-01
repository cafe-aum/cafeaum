# -*- coding: utf-8 -*-
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils.encoding import python_2_unicode_compatible


class Evenement(models.Model):
    class Meta:
       ordering = ('date',)

    titre = models.CharField(max_length=60)
    didascalie = models.CharField(max_length=512, blank=True)
    date = models.DateTimeField()
    duree = models.IntegerField(default=60)
    texte = models.TextField()
    texte2 = models.TextField()
    texte3 = models.TextField()
    texte4 = models.TextField()
    prix = models.FloatField()
    image = models.CharField(max_length=128, default='/static/img/...')
    lien = models.CharField(max_length=512, blank=True)

    def __str__(self):
        return ' | '.join([self.titre, self.texte[0:10] + "..."])

    def __unicode__(self):
        return ' | '.join([self.titre, self.texte[0:10] + "..."])


class Exposition(models.Model):
    titre = models.CharField(max_length=60)
    artiste = models.CharField(max_length=60)
    photo_artiste = models.CharField(max_length=128,default='/static/img/...')

    en_cours = models.BooleanField(default=True)

    texte = models.TextField()
    texte2 = models.TextField()
    texte3 = models.TextField()
    texte4 = models.TextField()
    didascalie = models.CharField(max_length=512, blank=True)

    def __str__(self):
        return ' | '.join([self.titre, self.artiste])

    def __unicode__(self):
        return ' | '.join([self.titre, self.artiste])


class ExpositionPhoto(models.Model):
    exposition = models.ForeignKey(Exposition, on_delete=models.CASCADE, related_name='photos')
    photo = models.CharField(max_length=128,default='/static/img/...')
    legende = models.CharField(max_length=128)

    def __str__(self):
        return ' '.join(["Photo de ", self.exposition.titre, self.legende])

    def __unicode__(self):
        return ' '.join(["Photo de ", self.exposition.titre, self.legende])

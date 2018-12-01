# -*- coding: utf-8 -*-
from django.db import models
from authentication.models import Account
from django.dispatch import receiver
from django.db.models.signals import pre_delete
from datetime import timedelta
from messaging.views import send_lesson_modification_email, send_lesson_cancellation_email

class UploadedImage(models.Model):
    image = models.ImageField('Updloaded image')
    nom = models.CharField(max_length=32)

    def __unicode__(self):
        return ' '.join(self.nom)

    def __str__(self):
        return ' '.join(self.nom)


class Professeur(models.Model):
    class Meta:
        ordering = ('nom', 'prenom',)

    nom = models.CharField(max_length=32)
    prenom = models.CharField(max_length=32)
    description = models.CharField(max_length=512)
    lien = models.CharField(max_length=128, null=True, blank=True)
    photo = models.CharField(max_length=128, null=True, blank=True, default="/static/img")

    def __str__(self):
        return ' '.join([self.prenom, self.nom])

    def __unicode__(self):
        return ' '.join([self.prenom, self.nom])


class Type(models.Model):
    nom = models.CharField(max_length=32, unique=True)

    def __str__(self):
        return self.nom


class Intensite(models.Model):
    nom = models.CharField(max_length=32, unique=True)

    def __str__(self):
        return self.nom


class LessonManager(models.Manager):
    def create_lesson(self, type, intensity, animator, date, duration, nb_places, price):
        lesson = Lesson(type=type, intensity=intensity, animator=animator, date=date, duration=duration, price=price)
        lesson.save(force_insert=True)
        return lesson


class Lesson(models.Model):
    class Meta:
       ordering = ('date',)

    type = models.ForeignKey(Type,  on_delete=models.CASCADE)
    intensity = models.ForeignKey(Intensite,  on_delete=models.CASCADE)
    animator = models.ForeignKey(Professeur, on_delete=models.CASCADE)
    date = models.DateTimeField()

    copy_type = models.CharField(max_length=30, editable=False)
    copy_intensity = models.CharField(max_length=30, editable=False)
    copy_date = models.DateTimeField(editable=False)

    duration = models.IntegerField() # in min
    nb_places = models.IntegerField(default=10)
    price = models.IntegerField(default=1)

    objects = LessonManager()

    def __unicode__(self):
        return ' '.join([str(self.date.strftime("%A %d %b %Y à %Hh%M")), str(self.type), str(self.intensity), str(self.animator), ])

    def __str__(self):
        return ' - '.join([str(self.date.strftime("%A %d %b %Y à %Hh%M")), str(self.type), str(self.intensity), str(self.animator), ])

    def save(self, *args, **kwargs):
        super(Lesson, self).save(*args, **kwargs)

    def get_type(self):
        return str(self.type)

    def get_copy_type(self):
        return self.copy_type

    def get_intensity(self):
        return str(self.intensity)

    def get_copy_intensity(self):
        return self.copy_intensity

    def get_str_animator(self):
        return str(self.animator)

    def get_animator(self):
        return self.animator

    def get_str_date(self):
        return str(self.date.strftime("%A %d %b %Y à %Hh%M"))

    def get_str_copy_date(self):
        return str(self.copy_date.strftime("%A %d %b %Y à %Hh%M"))

    def get_date(self):
        return self.date

    def get_str_duration(self):
        return str(self.duration)

    def get_duration(self):
        return self.duration

    def get_str_nb_places(self):
        return str(self.nb_places)

    def get_nb_places(self):
        return self.nb_places

    def get_price(self):
        return self.price

    def get_str_price(self):
        return str(self.price)


class LessonRecurrent(models.Model):
    class Meta:
       ordering = ('date',)

    type = models.ForeignKey(Type,  on_delete=models.CASCADE)
    intensity = models.ForeignKey(Intensite,  on_delete=models.CASCADE)
    animator = models.ForeignKey(Professeur, on_delete=models.CASCADE)
    date = models.DateTimeField()
    duration = models.IntegerField() # in min
    nb_places = models.IntegerField(default=10)
    price = models.IntegerField(default=1) # En points : 1h = 2pts / 1h30 = 3pts
    nb_semaines = models.IntegerField(default=13)

    def __unicode__(self):
        return ' '.join([str(self.date.strftime("%A %d %b %Y à %Hh%M")), str(self.type), str(self.intensity), str(self.animator), ])

    def __str__(self):
        return ' - '.join([str(self.date.strftime("%A %d %b %Y à %Hh%M")), str(self.type), str(self.intensity), str(self.animator), ])


class ReservationManager(models.Manager):

    def create_reservation(self, lesson, account, nb_persons, confirmed):
        reservation = Reservation(account=account, lesson=lesson, nb_personnes=nb_persons, confirmed=confirmed)
        reservation.save(force_insert=True)
        return reservation


class Reservation(models.Model):
    class Meta:
        ordering = ("lesson",)

    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    nb_personnes = models.IntegerField(default=1)
    checked_present = models.BooleanField(default=False)
    nb_present = models.IntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True, db_index=True)
    confirmed = models.BooleanField(default=False)

    objects = ReservationManager()

    def __unicode__(self):
        return ' '.join([str(self.account), str(self.lesson), "pour " + str(self.nb_personnes), str("Present" if self.checked_present else "Non Present")])

    def __str__(self):
        return ' >  < '.join(["Cours du " +str(self.lesson), "Réservé par : "+ str(self.account.first_name) + " "+ str(self.account.last_name), "pour " + str(self.nb_personnes), str("Present" if self.checked_present else "Non Present")])


class Tarif(models.Model):
    class Meta:
        ordering = ("prix",)

    description = models.CharField(max_length=128,default="")
    nb_cours = models.IntegerField()
    prix = models.IntegerField()

    def __unicode__(self):
        return ' '.join([self.description, str(self.nb_cours), "cours", str(self.prix)+" €"])

    def __str__(self):
        return ' '.join([self.description, str(self.nb_cours), "cours", str(self.prix)+" €"])

###############################
# Transaction related Objects #
###############################
class Formule(models.Model):
    montant = models.FloatField(default=0.0)
    nb_cours = models.IntegerField(default=0)
    description = models.CharField(max_length=64)

    def __unicode__(self):
        return ' '.join(["Formule ", str(self.nb_cours), "cours --", str(self.montant) + " €"])

    def __str__(self):
        return ' '.join(["Formule ", str(self.nb_cours), "cours --", str(self.montant) + " €"])


class CodeReduction(models.Model):
    code = models.CharField(max_length=10)
    pourcentage = models.IntegerField(default=0)

    def __unicode__(self):
        return ' '.join(["Code :", str(self.code), "- Réduction : ", str(self.pourcentage) + " %"])

    def __str__(self):
        return ' '.join(["Code :", str(self.code), "- Réduction : ", str(self.pourcentage) + " %"])


class TransactionManager(models.Manager):
    def create_transaction(self, account, montant, token):
        transaction = Transaction(account=account, montant=montant, token=token)
        transaction.save(force_insert=True)
        return transaction


class Transaction(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    montant = models.FloatField(default=0.0)
    token = models.CharField(max_length=64)
    created = models.DateTimeField(auto_now_add=True)

    objects = TransactionManager()

    def __unicode__(self):
        return ' '.join([str(self.account), str(self.montant) + " €", self.token])

    def __str__(self):
        return ' '.join([str(self.account), str(self.montant) + " €", self.token])


###############################
# Signal callbacks            #
###############################
@receiver(models.signals.post_save, sender=LessonRecurrent)
def create_lessons_from_template(sender, instance, created, *args, **kwargs):
    if created:
        for i in range(0, instance.nb_semaines):
            Lesson.objects.create_lesson(instance.type,
                                         instance.intensity,
                                         instance.animator,
                                         instance.date + timedelta(days=i*7),
                                         instance.duration,
                                         instance.nb_places,
                                         instance.price)


@receiver(models.signals.pre_save, sender=Lesson)
def warn_user_on_lesson_change(sender, instance, *args, **kwargs):
    if instance.copy_date != instance.date or\
       instance.copy_type != instance.type.nom or \
       instance.copy_intensity != instance.intensity.nom:
            reservations = Reservation.objects.filter(lesson=instance)
            for reservation in reservations:
                account = reservation.account
                send_lesson_modification_email(account,
                                               reservation.id,
                                               instance.get_type(),
                                               instance.get_intensity(),
                                               instance.get_str_animator(),
                                               instance.get_str_date(),
                                               instance.get_copy_type(),
                                               instance.get_copy_intensity(),
                                               instance.get_str_copy_date(),
                                               instance.get_str_duration(),
                                               )
    instance.copy_type = instance.type.nom
    instance.copy_intensity = instance.intensity.nom
    instance.copy_date = instance.date

@receiver(pre_delete, sender=Lesson)
def warn_users_before_deleting_lesson(sender, instance, **kwargs):
    reservations = Reservation.objects.filter(lesson=instance)

    for reservation in reservations:
        account = reservation.account
        nb_personnes = reservation.nb_personnes
        prix = instance.price
        account.credits += (prix * nb_personnes)
        account.save()
        send_lesson_cancellation_email(account,
                                       reservation.id,
                                       instance.get_type(),
                                       instance.get_intensity(),
                                       instance.get_str_animator(),
                                       instance.get_str_date(),
                                       instance.get_price(),
                                       instance.get_str_duration(),
                                       nb_personnes)

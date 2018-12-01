from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from rest_framework import views
from rest_framework import permissions, views, status, viewsets, generics
from rest_framework.response import Response
from authentication.models import *
from boutique.models import Createur
from evenements.models import *
from restaurant.models import *
from yoga.models import  *

class IndexView(TemplateView):
    template_name = 'cafeyoga/index.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(IndexView, self).dispatch(*args, **kwargs)



class LandingPageView(TemplateView):
    template_name = 'general.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(LandingPageView, self).dispatch(*args, **kwargs)


class DeleteAllInDb(views.APIView):

    def post(self, request, format=None):
        data = json.loads(request.body)
        account_id = data['account_id']
        account = Account.objects.get(id=account_id)
        if not account:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if not account.is_staff:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        Account.objects.all().delete()
        PasswordRecovery.objects.all().delete()
        Createur.objects.all().delete()
        Exposition.objects.all().delete()
        Evenement.objects.all().delete()
        Categorie.objects.all().delete()
        Specificite.objects.all().delete()
        Plat.objects.all().delete()
        Brunch.objects.all().delete()
        BrunchItem.objects.all().delete()
        Boisson.objects.all().delete()
        JourDeSemaine.objects.all().delete()
        SlotOuverture.objects.all().delete()
        Fermeture.objects.all().delete()
        RestaurantReservationSlot.objects.all().delete()
        RestaurantReservationContact.objects.all().delete()
        UploadedImage.objects.all().delete()
        Professeur.objects.all().delete()
        Type.objects.all().delete()
        Intensite.objects.all().delete()
        Lesson.objects.all().delete()
        LessonRecurrent.objects.all().delete()
        Reservation.objects.all().delete()
        Tarif.objects.all().delete()
        Formule.objects.all().delete()
        CodeReduction.objects.all().delete()
        Transaction.objects.all().delete()

        return Response(status.HTTP_200_OK)




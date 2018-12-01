from django.contrib import admin
from .models import LessonRecurrent,\
                    Lesson,\
                    Type, \
                    Intensite, \
                    Professeur, \
                    Tarif, \
                    UploadedImage, \
                    Reservation, \
                    Transaction, \
                    Formule, \
                    CodeReduction

admin.site.register(LessonRecurrent)
admin.site.register(Lesson)
admin.site.register(Reservation)
admin.site.register(Professeur)
admin.site.register(Tarif)
admin.site.register(Type)
admin.site.register(Intensite)
admin.site.register(UploadedImage)

admin.site.register(Transaction)
admin.site.register(Formule)
admin.site.register(CodeReduction)

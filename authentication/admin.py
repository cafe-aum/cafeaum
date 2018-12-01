from django.contrib import admin
from .models import Account, PasswordRecovery

admin.site.register(Account)
admin.site.register(PasswordRecovery)
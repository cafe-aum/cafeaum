# -*- coding: utf-8 -*-
from django.contrib.auth.models import AbstractBaseUser
from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import PermissionsMixin


class AccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('Users must have a valid email address.')

        if not kwargs.get('last_name') and not kwargs.get('first_name'):
            raise ValueError('Users must have a valid last_name.')

        account = self.model(
            email=self.normalize_email(email),
            first_name=kwargs.get('first_name'),
            last_name=kwargs.get('last_name'),
        )

        account.set_password(password)
        account.save()
        return account

    def create_superuser(self, email, password, **kwargs):
        account = self.create_user(email, password, **kwargs)

        account.is_admin = True
        account.is_staff = True
        account.is_superuser = True

        account.save()
        return account


class Account(AbstractBaseUser):
    class Meta:
        ordering = ('last_name', 'first_name',)

    email = models.EmailField(unique=True)

    first_name = models.CharField(max_length=40, blank=True)
    last_name = models.CharField(max_length=40, blank=True)

    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    credits = models.IntegerField(default=0)

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __unicode__(self):
        return ' '.join([self.first_name, self.last_name])#self.email

    def __str__(self):
        return ' '.join([self.first_name, self.last_name, '('+self.email+')', '--> ' + str(self.credits) + ' crédits' ])

    def get_full_name(self):
        return ' '.join([self.first_name, self.last_name])

    def get_short_name(self):
        return ' '.join([self.first_name, self.last_name])

    def get_last_name(self):
        return self.last_name

    def get_first_name(self):
        return self.first_name

    def get_email(self):
        return self.email

    def get_str_credits(self):
        return str(self.credits)

    def has_perm(self, perm, obj=None):
        return self.is_admin == True

    def has_module_perms(self, package_name):
        return self.is_admin == True


class PasswordRecoveryManager(models.Manager):
    def create_password_recovery(self, email, token, expiration_date):
        pwd_recovery = PasswordRecovery(email=email, token=token, expiration_date=expiration_date)
        pwd_recovery.save(force_insert=True)
        return pwd_recovery


class PasswordRecovery(models.Model):

    email = models.EmailField(unique=True)
    token = models.CharField(max_length=40, unique=True)
    expiration_date = models.DateTimeField()

    objects = PasswordRecoveryManager()

    def __unicode__(self):
        return ' '.join([self.email, '|', self.token, '| Expire à ', str(self.expiration_date)])

    def __str__(self):
        return ' '.join([self.email, '|', self.token, '| Expire à ', str(self.expiration_date)])

    def check_expiration_date(self, now):
        if self.expiration_date > now:
            return True
        return False

    def get_expiration_date(self):
        return self.expiration_date

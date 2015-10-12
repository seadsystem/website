import time
import requests
import re
import ast
import json
from django.http import HttpResponseRedirect, HttpResponse
from seadssite.forms import UserForm, UserProfileForm, PasswordResetRequestForm
from django.template import RequestContext
from django.shortcuts import render, render_to_response
from django.contrib.auth import authenticate, login
from django.views.generic import View, CreateView
from django.core.urlresolvers import reverse
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from seadssite.forms import UserForm, UserProfileForm
from .models import Devices, Map
from .helpers import *


from django.core.mail import send_mail
from django.shortcuts import render_to_response as render_to

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags


from django.core.urlresolvers import reverse

from seadssite.models import Document
from seadssite.forms import DocumentForm

'''
load main page as "index"
'''
class IndexView(TemplateView):
  template_name = 'index.html'

def help(request, template_name='registration/login.html'):
    # for SMS http://stackoverflow.com/questions/430582/sending-an-sms-to-a-cellphone-using-django
    email = request.POST['email']
    send_mail('Login Information', 'This is a test', 'seadssystems@gmail.com', [email])
    return HttpResponseRedirect('/login')

'''
registration page controller
sends a user to the registration page
'''
def register(request):
    #is context needed?
    context = RequestContext(request)
    registered = False
    #We have these save outside of any control in case there are errors, so the user doesn't need to re-enter anything
    user_save = request.POST.get('username') or ''
    phone_save = request.POST.get('phone') or ''
    first_name_save = request.POST.get('first_name') or ''
    last_name_save = request.POST.get('last_name') or ''
    email_save = request.POST.get('email') or ''
    cellProvider_save = request.POST.get('cellProvider') or ''
    password_save = request.POST.get('password') or ''

    #if a user "POST"s, check phone number, provider and user/profile form(models)
    if request.method == 'POST':
        print "user is about to register"
        phone = request.POST['phone']
        cellProvider = request.POST['cellProvider']
        user_form = UserForm(data=request.POST)
        profile_form = UserProfileForm(data=request.POST)

        # If the two forms are valid...
        if user_form.is_valid() and profile_form.is_valid():
            #Creating a new user
            user = user_form.save()
            user.set_password(user.password)
            user.save()
            profile = profile_form.save(commit=False)
            profile.user = user
            profile.save()
            # log the user in and send them to the homepage
            registered = True
            user = authenticate (username=request.POST['username'], password=request.POST['password'])
            login(request, user)

            #sending a welcome email to the new user
            #for html/css: http://stackoverflow.com/questions/3237519/sending-html-email-in-django
            print "the email is about to be sent"
            toemail = request.POST['email']
            subject, from_email, to = 'Hi', 'seadssystems@gmail.com', [toemail]
            html_content = render_to_string('welcome.html', {'varname':'value', 'first_name':first_name_save})
            text_content = strip_tags(html_content)
            msg = EmailMultiAlternatives(subject, text_content, from_email, [toemail])
            msg.attach_alternative(html_content, "text/html")
            msg.send()

            return HttpResponseRedirect('/')

        #if the forms are invalid show the user which part is invalid
        else:
            print user_form.errors, profile_form.errors

            # If form is not valid, this would re-render inputtest.html with the errors in the form.
            #render_to_response(request, 'register.html', {'data': 'hello'})
            render_to_response('register.html', {'data': 'hello'})

    #keep the fields populated so the user doesn't have to re-enter
    else:
        user_form = UserForm()
        profile_form = UserProfileForm()

    return render_to_response(
            'register.html',
            {'user_form': user_form, 'profile_form': profile_form, 'registered': registered, 'user': user_save, 'phone': phone_save, 'first_name':first_name_save, 'last_name':last_name_save, 'email':email_save, 'cell_prov':cellProvider_save, 'password':password_save},
            context)


'''
device dashboard page controller
TODO: users can delete eachothers devices I think
'''

def DashboardView(request):
    #get needed variables set up, and try to make sure only the users devices are shown
    if not request.user.is_authenticated():
        return HttpResponseRedirect('/login/?next=%s' % request.path)
    alerts = []
    current_user = request.user
    user_devices_map = Map.objects.filter(user=current_user.id)

    #if the user clicked register (and dashboard -- that is register a device)
    #we set the new id and new name as what was submitted in the form
    #if there are any alerts (invalid id etc), they will get appened to alert
    if request.POST.get('register'):
        new_device_id = request.POST.get('device_id')
        new_device_name = request.POST.get('device_name')
        alert = register_device(new_device_id, new_device_name, current_user)
        if alert is not None:
            alerts.append(alert)

    #if the user clicked delete
    #we delete the specified device
    elif request.POST.get('delete'):
        device_id = request.POST.get('delete')
        alert = delete_device(device_id, current_user)
        if alert is not None:
            alerts.append(alert)


    connected_devices = get_connected_devices(user_devices_map)
    current_power_usage = get_max_power_usage(5, user_devices_map) #5 min
    average_power_usage = get_average_power_usage(1440, user_devices_map, 500) # 1 day
    current_power_map = get_current_power_map(user_devices_map)


    return render(request, 'dashboard.html', {'maps': user_devices_map,
        'alerts':alerts, 'connected_devices': connected_devices,
        'current_power_usage': current_power_usage,
        'average_power_usage': average_power_usage,
        'power_map': current_power_map})


def DevicesView(request):
    #get needed variables set up, and try to make sure only the users devices are shown
    alerts = []
    current_user = request.user
    user_devices_map = Map.objects.filter(user=current_user.id)

    #if the user clicked the editable field and submitted an edit
    #changes the edited field to the new submission
    if request.POST.get('name') == "modify":
        device_id = request.POST.get('pk')
        new_name = request.POST.get('value')
        modify_device_name(device_id, new_name)

    #if the user clicked register
    #we set the new id and new name as what was submitted in the form
    #if there are any alerts (invalid id etc), they will get appened to alert
    elif request.POST.get('register'):
        new_device_id = request.POST.get('device_id')
        new_device_name = request.POST.get('device_name')
        alert = register_device(new_device_id, new_device_name, current_user)
        if alert is not None:
            alerts.append(alert)

    #if the user clicked delete
    elif request.POST.get('delete'):
        device_id = request.POST.get('delete')
        alert = delete_device(device_id, current_user)
        if alert is not None:
            alerts.append(alert)

    return render(request, 'devices.html', {'maps': user_devices_map, 'alerts':alerts})

'''
Visualizaition of each DEVICE
'''
def VisualizationView(request, device_id):
    params = request.GET
    start_time = params.get('start_time', 0)
    end_time = params.get('end_time', int(time.time()))
    dtype = params.get('dtype', 'W')
    granularity = params.get('granularity', 3000)
    api_response_all = get_plug_data(start_time, end_time, None, device_id, granularity)
    api_response = get_plug_data(start_time, end_time, dtype, device_id, granularity)
    dmax = device_max_data(api_response)
    davg = device_avg_data(api_response)
    #NEED TO WORK ON THIS COMMAND AND ADD IT TO DASHBOARD
    #dcur = device_current_data(device_id,dtype)


    if request.is_ajax():
        return HttpResponse(json.dumps([api_response, {'avg': davg, 'max': dmax}]), content_type="application/json")

    return render(request, 'visualization.html', {'data':api_response, 'data2':api_response_all, 'max': dmax, 'avg': davg})



def list(request):
	return render_to_response('list.html')
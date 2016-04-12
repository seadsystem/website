from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.shortcuts import render, render_to_response
from django.contrib.auth import authenticate, login
from django.views.generic.base import TemplateView
from seadssite.forms import UserForm, UserProfileForm
from .models.models import Device
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

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
    # is context needed?
    context = RequestContext(request)
    registered = False
    # We have these save outside of any control in case there are errors, so the user doesn't need to re-enter anything
    user_save = request.POST.get('username') or ''
    phone_save = request.POST.get('phone') or ''
    first_name_save = request.POST.get('first_name') or ''
    last_name_save = request.POST.get('last_name') or ''
    email_save = request.POST.get('email') or ''
    cell_provider_save = request.POST.get('cell_provider') or ''
    password_save = request.POST.get('password') or ''

    # if a user "POST"s, check phone number, provider and user/profile form(models)
    if request.method == 'POST':
        print("user is about to register")
        phone = request.POST['phone']
        cell_provider = request.POST['cell_provider']
        user_form = UserForm(data=request.POST)
        profile_form = UserProfileForm(data=request.POST)

        # If the two forms are valid...
        if user_form.is_valid() and profile_form.is_valid():
            # Creating a new user
            user = user_form.save()
            user.set_password(user.password)
            user.save()
            profile = profile_form.save(commit=False)
            profile.user = user
            profile.save()
            # log the user in and send them to the homepage
            user = authenticate(username=request.POST['username'], password=request.POST['password'])
            login(request, user)

            # sending a welcome email to the new user needs to be implemented here

            return HttpResponseRedirect('/')

        # if the forms are invalid show the user which part is invalid
        else:
            print (user_form.errors, profile_form.errors)

            # If form is not valid, this would re-render inputtest.html with the errors in the form.
            # render_to_response(request, 'register.html', {'data': 'hello'})
            render_to_response('register.html', {'data': 'hello'})

    # keep the fields populated so the user doesn't have to re-enter
    else:
        user_form = UserForm()
        profile_form = UserProfileForm()

    return render_to_response(
            'register.html',
            {'user_form': user_form, 'profile_form': profile_form, 'registered': registered, 'user': user_save, 'phone': phone_save, 'first_name':first_name_save, 'last_name':last_name_save, 'email':email_save, 'cell_prov':cell_provider_save, 'password':password_save},
            context)


'''
device dashboard page controller
TODO: users can delete each others devices I think
'''

def DashboardView(request):
    # get needed variables set up, and try to make sure only the users devices are shown
    if not request.user.is_authenticated():
        return HttpResponseRedirect('/login/?next=%s' % request.path)
    current_user = request.user

    # if the user clicked register (and dashboard -- that is register a device)
    # we set the new id and new name as what was submitted in the form
    # if there are any alerts (invalid id etc), they will get appened to alert
    if request.POST.get('register'):
        print(request)
        new_device_id = request.POST.get('device_id')
        new_device_name = request.POST.get('device_name')
        Device.objects.register_device(new_device_id, new_device_name, request.user)
    # if the user clicked delete
    # we delete the specified device
    elif request.POST.get('delete'):
        device_id = request.POST.get('delete')
        device = Device.objects.get(device_id=device_id)
        device.deactivate_device()

    connected_user_devices = Device.objects.filter(user=current_user, is_active=True)

    return render(request, 'dashboard.html', {'devices': connected_user_devices})

def TimerView(request):
    # get needed variables set up, and try to make sure only the users devices are shown
    if not request.user.is_authenticated():
        return HttpResponseRedirect('/login/?next=%s' % request.path)
    current_user = request.user

    connected_user_devices = Device.objects.filter(user=current_user, is_active=True)

    return render(request, 'timer.html', {'devices': connected_user_devices})

def DevicesView(request):
    # get needed variables set up, and try to make sure only the users devices are shown
    current_user = request.user

    # if the user clicked the editable field and submitted an edit
    # changes the edited field to the new submission
    if request.POST.get('name') == "modify":
        device_id = request.POST.get('pk')
        device = Device.objects.get(device_id=device_id)
        new_name = request.POST.get('value')
        device.name = new_name
        device.save()
    # if the user clicked register
    # we set the new id and new name as what was submitted in the form
    # if there are any alerts (invalid id etc), they will get appened to alert
    elif request.POST.get('register'):
        new_device_id = request.POST.get('device_id')
        new_device_name = request.POST.get('device_name')
        Device.objects.register_device(new_device_id, new_device_name, current_user)
    # if the user clicked delete
    elif request.POST.get('delete'):
        print("HEREOMG")
        device_id = request.POST.get('delete')
        device = Device.objects.get(device_id=device_id)
        device.deactivate_device()

    user_devices = Device.objects.filter(user=current_user, is_active=True)

    return render(request, 'devices.html', {'devices': user_devices})
'''
Visualizaition of each DEVICE
'''
def VisualizationView(request, device_id):
    return None

def list(request):
    return render_to_response('list.html')

def graph(request):
    if not request.user.is_authenticated():
        return HttpResponseRedirect('/login/?next=%s' % request.path)
    current_user = request.user

    connected_user_devices = Device.objects.filter(user=current_user, is_active=True)

    return render(request, 'graph.html', {'devices': connected_user_devices})

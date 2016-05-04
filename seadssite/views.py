from django.contrib.auth import authenticate, login
from django.core.mail import send_mail
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.views.generic.base import TemplateView
from django.views.generic import View


from seadssite.forms import UserForm
from seadssite.models import Device


class IndexView(TemplateView):
    """
    load main page as "index"
    """
    template_name = 'index.html'


class RegisterView(View):
    """
    registration page controller
    sends a user to the registration page
    """
    form_class = UserForm
    template_name = 'registration/register.html'

    def get(self, request):
        if request.user.is_authenticated():
            return redirect('/dashboard')
        user_form = self.form_class()
        return render(request, 'registration/register.html', {'form': user_form})

    def post(self, request):
        user_form = UserForm(data=request.POST)
        if user_form.is_valid():
            # Creating a new user
            user = user_form.save(commit=False) #don't save to db, we do this after setting the password
            user.set_password(user.password)
            user.save()
            # log the user in and send them to the homepage
            user = authenticate(username=request.POST['username'], password=request.POST['password'])
            login(request, user)
            return HttpResponseRedirect('/dashboard')
            # TODO: sending a welcome email to the new user needs to be implemented here
        else:
            return render(request, self.template_name, {'form': user_form})

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
        print('Here')
        new_device_id = request.POST.get('device_id')
        new_device_name = request.POST.get('device_name')
        Device.objects.register_device(new_device_id, new_device_name, current_user)
    # if the user clicked delete
    # we delete the specified device
    elif request.POST.get('delete'):
        device_id = request.POST.get('delete')
        device = Device.objects.get(device_id=device_id)
        device.deactivate_device()

    connected_user_devices = Device.objects.filter(user=current_user, is_active=True)
    print(connected_user_devices)
    print(current_user)
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
        device_id = request.POST.get('delete')
        device = Device.objects.get(device_id=device_id)
        device.deactivate_device()

    user_devices = Device.objects.filter(user=current_user, is_active=True)

    return render(request, 'devices.html', {'devices': user_devices})

def graph(request):
    if not request.user.is_authenticated():
        return HttpResponseRedirect('/login/?next=%s' % request.path)
    current_user = request.user

    connected_user_devices = Device.objects.filter(user=current_user, is_active=True)

    return render(request, 'graph.html', {'devices': connected_user_devices})

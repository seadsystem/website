from django.http import HttpResponseRedirect, HttpResponse, HttpResponseNotAllowed
from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.views.generic import View

from seadssite.models import Device

import google.auth.transport.requests
import google.oauth2.id_token

HTTP_REQUEST = google.auth.transport.requests.Request()

import firebase_admin
from firebase_admin import credentials, db

cred = credentials.Certificate('./seads-8023c-firebase-adminsdk-ejeko-63518da322.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://seads-8023c.firebaseio.com/'
})


class IndexView(TemplateView):
    """
    load main page as "index"
    """
    template_name = 'index.html'

    def get(self, request):
        authenticated = False
        # Check if user is logged in
        if 'user_id' in request.session and request.session['user_id'] is not None:
            authenticated = True

        return render(request, 'index.html', {'authenticated': authenticated})


def AuthenticateView(request):
    if not request.is_ajax():
        return HttpResponseNotAllowed(['POST'])

    id_token = request.META['HTTP_AUTHORIZATION'].split(' ').pop()

    # Verify id token
    claims = google.oauth2.id_token.verify_firebase_token(id_token, HTTP_REQUEST)
    if not claims:
        return HttpResponse(status=401)

    # Set session data
    request.session['user_id'] = claims['user_id']
    request.session['email'] = claims['email']
    return HttpResponse(status=200)


def LogoutView(request):
    if not request.is_ajax() or not request.method == 'POST':
        return HttpResponseNotAllowed(['POST'])

    request.session.clear()
    return HttpResponse(status=200)


'''
device dashboard page controller
TODO: users can delete each others devices I think
'''
def DashboardView(request):
    authenticated = False
    if not 'user_id' in request.session:
        return HttpResponseRedirect('/login/?next=%s' % request.path)

    if request.session['user_id'] is not None:
        authenticated = True

    ref = db.reference('users').child(request.session['user_id']).child('devices')

    # Register a new device
    if request.POST.get('device_id'):
        new_device_name = request.POST.get('device_name')
        new_device_id = request.POST.get('device_id')
        ref.update({
            new_device_id: {
                'name': new_device_name
            }
        })

    # Delete a device
    elif request.POST.get('delete'):
        device_id = request.POST.get('delete')
        ref.child(device_id).delete()

    devices = ref.get()

    return render(request, 'dashboard.html', {'devices': devices, 'authenticated': authenticated})


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
    # fetch request, process data package
    elif request.POST.get('delete'):
        device_id = request.POST.get('delete')
        device = Device.objects.get(device_id=device_id)
        device.deactivate_device()

    user_devices = Device.objects.filter(user=current_user, is_active=True)
    return render(request, 'devices.html', {'devices': user_devices})


def graph(request):
    if not 'user_id' in request.session:
        return HttpResponseRedirect('/login/?next=%s' % request.path)

    if request.session['user_id'] is not None:
        authenticated = True

    return render(request, 'graph.html', {'authenticated': authenticated})
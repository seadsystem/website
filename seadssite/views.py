from django.http import HttpResponseRedirect, HttpResponse, HttpResponseNotAllowed
from django.shortcuts import render
from django.views.generic.base import TemplateView

import google.auth.transport.requests
import google.oauth2.id_token

import simplejson

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

def DashboardView(request):
    authenticated = False
    if 'user_id' not in request.session:
        return render(request, 'dashboard.html', {'authenticated': authenticated})

    if request.session['user_id'] is not None:
        authenticated = True

    userRef = db.reference('users').child(request.session['user_id']).child('devices')

    # Register a new device
    if request.POST.get('device_id'):
        new_device_name = request.POST.get('device_name')
        new_device_id = request.POST.get('device_id')
        userRef.update({
            new_device_id: {
                'name': new_device_name
            }
        })

    # Delete a device
    elif request.POST.get('delete'):
        device_id = request.POST.get('delete')
        userRef.child(device_id).delete()

    devices = userRef.get()

    return render(request, 'dashboard.html', {'authenticated': authenticated, 'devices': devices})

def DeviceView(request, device_id):
    """
        load main page as "index"
        """
    authenticated = False
    if 'user_id' not in request.session:
        return render(request, 'device.html', {'authenticated': authenticated})

    if request.session['user_id'] is not None:
        authenticated = True

    userRef = db.reference('users').child(request.session['user_id']).child('devices').child(device_id)
    device = simplejson.dumps(userRef.get())

    print(device_id)
    print(device)
    return render(request, 'device.html', {'authenticated': authenticated, 'deviceId': device_id, 'device': device})



def TimerView(request):
    # get needed variables set up, and try to make sure only the users devices are shown
    if 'user_id' not in request.session:
        return HttpResponseRedirect('/login/?next=%s' % request.path)

    authenticated = False
    if request.session['user_id'] is not None:
        authenticated = True

    return render(request, 'timer.html', {'authenticated': authenticated})


def DevicesView(request):
    # get needed variables set up, and try to make sure only the users devices are shown
    # current_user = request.user
    #
    # # if the user clicked the editable field and submitted an edit
    # # changes the edited field to the new submission
    # if request.POST.get('name') == "modify":
    #     device_id = request.POST.get('pk')
    #     device = Device.objects.get(device_id=device_id)
    #     new_name = request.POST.get('value')
    #     device.name = new_name
    #     device.save()
    # # if the user clicked register
    # # we set the new id and new name as what was submitted in the form
    # # if there are any alerts (invalid id etc), they will get appened to alert
    # elif request.POST.get('register'):
    #     new_device_id = request.POST.get('device_id')
    #     new_device_name = request.POST.get('device_name')
    #     Device.objects.register_device(new_device_id, new_device_name, current_user)
    #
    # # if the user clicked delete
    # # fetch request, process data package
    # elif request.POST.get('delete'):
    #     device_id = request.POST.get('delete')
    #     device = Device.objects.get(device_id=device_id)
    #     device.deactivate_device()
    #
    # user_devices = Device.objects.filter(user=current_user, is_active=True)
    return render(request, 'devices.html')

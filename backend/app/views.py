from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .utils.supabase_utils import fetch_from_supabase, insert_to_supabase
# Create your views here.

def fetch_data_view(request):
    data = fetch_from_supabase('')
    return JsonResponse(data, safe=False)

def insert_data_view(request):
    if request.method == 'POST':
        data = request.POST.dict()
        response = insert_to_supabase('', data)
        return JsonResponse(response, safe=False)
    
def home(request):
    return HttpResponse("Bem-vindo(a) à página inicial!")

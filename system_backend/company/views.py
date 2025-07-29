from io import BytesIO

from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import fitz  # PyMuPDF
from django.conf import settings

from django.http import FileResponse

from .models import Stamping, DocumentProcessing
from .serializers import StampingSerializer
from company.stamping.pdf import WriteToPdf


class StampingViewSet(generics.ListAPIView):
    queryset = Stamping.objects.all()
    serializer_class = StampingSerializer

    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    

    


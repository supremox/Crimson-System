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
    

    
# In your DRF project, for example, in `your_app/views.py`

import json
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import StreamingHttpResponse

class GenerateStampedPDFView(APIView):
    """
    A DRF class-based view that takes a document URL and stamp data,
    calls an external Next.js API to generate a stamped PDF, and streams
    the resulting PDF file back to the client.

    This view expects a JSON payload in the POST request body with the
    following structure:
    {
        "document_url": "https://example.com/your-document",
        "stamps": [
            {"text": "Approved", "x": 100, "y": 700},
            {"text": "Signed by Jane Doe", "x": 100, "y": 50, "pageIndex": 1}
        ]
    }
    """
    # The URL of your Next.js API route.
    # IMPORTANT: Change this to your actual deployed URL or localhost during development.
    nextjs_api_url = "http://localhost:3000/api/generate-and-stamp-pdf"

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests to generate and serve the stamped PDF.
        """
        # 1. Get data from the request body
        document_url = request.data.get('document_url')
        stamps_data = request.data.get('stamps', [])

        # Basic validation
        if not document_url:
            return Response(
                {"error": "A 'document_url' is required in the request body."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 2. Prepare parameters for the Next.js API call
        # The Next.js API expects stamps as a URL-encoded JSON string.
        params = {
            'url': document_url,
            'stamps': json.dumps(stamps_data)
        }

        try:
            # 3. Call the external Next.js API to get the PDF file
            # We use `stream=True` to handle potentially large files efficiently.
            api_response = requests.get(self.nextjs_api_url, params=params, stream=True)
            
            # Raise an HTTPError if the response status is 4xx or 5xx
            api_response.raise_for_status()

            # 4. Stream the PDF content from the Next.js API response
            # to the DRF response
            response = StreamingHttpResponse(
                api_response.iter_content(chunk_size=8192),
                content_type='application/pdf'
            )
            
            # 5. Set the correct headers for the file download
            response['Content-Disposition'] = 'attachment; filename="stamped_document.pdf"'
            
            return response

        except requests.exceptions.HTTPError as e:
            # Handle HTTP errors from the Next.js API (e.g., 400 Bad Request, 500 Internal Server Error)
            print(f"Next.js API returned an HTTP error: {e.response.text}")
            return Response(
                {"error": f"Failed to generate PDF: {e.response.text}"},
                status=e.response.status_code
            )
        except requests.exceptions.RequestException as e:
            # Handle other request-related errors (e.g., network issues)
            print(f"Error calling Next.js API: {e}")
            return Response(
                {"error": f"Internal server error while communicating with PDF generation service."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Example `urls.py` configuration for this view:
# from django.urls import path
# from .views import GenerateStampedPDFView
#
# urlpatterns = [
#     path('generate-stamped-pdf/', GenerateStampedPDFView.as_view(), name='generate-stamped-pdf'),
# ]


# Example usage from a client (e.g., Postman or a frontend API call):
#
# POST to: http://localhost:8000/company/stamped/document/
#
# With JSON Body:
# {
#     "document_url": "https://docs.djangoproject.com/en/5.0/",
#     "stamps": [
#         {"text": "Django Docs Reference", "x": 50, "y": 750, "size": 20, "color": [0, 0, 0.8]},
#         {"text": "Official Documentation", "x": 300, "y": 70, "pageIndex": 0, "size": 16}
#     ]
# }

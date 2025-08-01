from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('stamping/', views.StampingViewSet.as_view()),
    path('stamped/document/', views.GenerateStampedPDFView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
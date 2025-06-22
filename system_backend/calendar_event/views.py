from rest_framework import generics, status
from rest_framework.response import Response
from .models import CalendarEvent, Leave, ShiftChangeRequest
from .serializers import CalendarEventSerializer, LeaveSerializer, ShiftChangeRequestSerializer

class CalendarEventListCreateView(generics.ListCreateAPIView):
    queryset = CalendarEvent.objects.all()
    serializer_class = CalendarEventSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                "message": "Calendar event created successfully.",
                "event": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "message": "Calendar event request creation failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class LeaveCreateView(generics.CreateAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request  # Needed for access to `request.user`
        return context
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                "message": "Leave filed successfully.",
                "leave": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "message": "Leave creation failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
class ShiftChangeCreateView(generics.CreateAPIView):
    queryset = ShiftChangeRequest.objects.all()
    serializer_class = ShiftChangeRequestSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                "message": "Shift change request created successfully.",
                "shift_change_request": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "message": "Shift change request creation failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


from rest_framework import generics, status
from rest_framework.response import Response
from .models import CalendarEvent, Leave, ShiftChangeRequest
from .serializers import CalendarEventSerializer, LeaveListSerializer, LeaveStatusUpdateSerializer, LeaveSerializer, ShiftChangeListSerializer, ShiftChangeRequestSerializer

class CalendarEventListCreateView(generics.ListCreateAPIView):
    queryset = CalendarEvent.objects.all()
    serializer_class = CalendarEventSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        print(f"Calendar Data: {request.data}")
        if serializer.is_valid():
            print(f"Data: {serializer.validated_data}")
            self.perform_create(serializer)
            return Response({
                "message": "Calendar event created successfully.",
            }, status=status.HTTP_201_CREATED)

        return Response({
            "message": "Calendar event request creation failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
class LeaveListView(generics.ListAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveListSerializer


class LeaveDetailedListView(generics.RetrieveAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveListSerializer

class LeaveUpdateListView(generics.UpdateAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveStatusUpdateSerializer

    def perform_update(self, serializer):
        # print("🟡 Incoming data from frontend:", self.request.data)
        serializer.save(leave_status=self.request.data['leave_status'])


class LeaveCreateView(generics.CreateAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request  # Needed for access to `request.user`
        return context
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        print(f"Leave: {request.data}")
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                "message": "Leave filed successfully.",
            }, status=status.HTTP_201_CREATED)

        return Response({
            "message": "Leave creation failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
class ShiftChangeListView(generics.ListAPIView):
    queryset = ShiftChangeRequest.objects.all()
    serializer_class = ShiftChangeListSerializer

class ShiftChangeDetailedListView(generics.RetrieveAPIView):
    queryset = ShiftChangeRequest.objects.all()
    serializer_class = ShiftChangeListSerializer

class ShiftChangeUpdateListView(generics.UpdateAPIView):
    queryset = ShiftChangeRequest.objects.all()
    serializer_class = LeaveStatusUpdateSerializer
    
class ShiftChangeCreateView(generics.CreateAPIView):
    queryset = ShiftChangeRequest.objects.all()
    serializer_class = ShiftChangeRequestSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request  # Needed for access to `request.user`
        return context
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                "message": "Shift change request created successfully.",
            }, status=status.HTTP_201_CREATED)

        return Response({
            "message": "Shift change request creation failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


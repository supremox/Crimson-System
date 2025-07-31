from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import CalendarEvent, Leave, ShiftChangeRequest
from .serializers import CalendarEventSerializer, LeaveListSerializer, LeaveStatusUpdateSerializer, LeaveSerializer, ShiftChangeListSerializer, ShiftChangeRequestSerializer

class CalendarEventListCreateView(generics.ListCreateAPIView):
    serializer_class = CalendarEventSerializer

    def get_queryset(self):
        company = self.request.user.company
        return CalendarEvent.objects.filter(company=company)
    
    def perform_create(self, serializer):
        company = self.request.user.company
        serializer.save(company=company)

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
    
class LeaveUserListView(generics.ListAPIView):
    serializer_class = LeaveListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Leave.objects.filter(employee__user=self.request.user)
    
class LeaveAllEmployeeListView(generics.ListAPIView):
    serializer_class = LeaveListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.company
        return Leave.objects.filter(employee__user__company=user_company)

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
    serializer_class = ShiftChangeListSerializer
  
    def get_queryset(self):
        user_company = self.request.user.company
        return ShiftChangeRequest.objects.filter(employee__user__company=user_company)

class ShiftChangeUserListView(generics.ListAPIView):
    serializer_class = ShiftChangeListSerializer

    def get_queryset(self):
        return Leave.objects.filter(employee__user=self.request.user)

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


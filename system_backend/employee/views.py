from rest_framework import generics, status
from rest_framework.response import Response
from .models import Employee, Department, Position, Shift, Incentive, Work_days, OnCall_days
from .serializers import ( 
    EmployeeSerializer, 
    DepartmentSerializer, 
    PositionSerializer, 
    ShiftSerializer,
    IncentiveSerializer,
    WorkDaysSerializer,
    OnCall_days
)

class EmployeeListCreateView(generics.ListCreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                "message": "Employee created successfully.",
                "employee": serializer.data
            }, status=status.HTTP_201_CREATED)
       
        return Response({
            "message": "Employee creation failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
class DepartmentListCreateView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                "message": "Department created successfully.",
                "department": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "message": "Department creation failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
class DepartmentNameListView(generics.ListAPIView):
    def get(self, request, *args, **kwargs):
        departments = Department.objects.values_list('department_name', flat=True)
        return Response({"departments": list(departments)})

class PositionListCreateView(generics.ListCreateAPIView):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                "message": "Position created successfully.",
                "position": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "message": "Position creation failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
class ShiftListCreateView(generics.ListCreateAPIView):
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                "message": "Shift created successfully.",
                "shift": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "message": "Shift creation failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    
class IncentiveListCreateView(generics.ListCreateAPIView):
    queryset = Incentive.objects.all()
    serializer_class = IncentiveSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                "message": "Incentive created successfully.",
                "incentive": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "message": "Incentive creation failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)




    


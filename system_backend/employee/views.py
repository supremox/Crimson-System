from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Employee, Department, Position, Shift, Incentive, TotalLeave
from .serializers import ( 
    EmployeeSerializer, 
    DepartmentSerializer, 
    PositionSerializer, 
    ShiftSerializer,
    IncentiveSerializer,
    TotalLeaveSerializer
)

class EmployeeListCreateView(generics.ListCreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    def get(self, request, *args, **kwargs):
        employees = self.get_queryset().select_related('user', 'department', 'position')
        data = []
        for emp in employees:
            data.append({
                "id": emp.id,
                "employee_id": emp.employee_id,
                "first_name": emp.user.first_name if emp.user else "",
                "last_name": emp.user.last_name if emp.user else "",
                "email": emp.user.email if emp.user else "",
                "department": emp.department.department_name if emp.department else "",
                "position": emp.position.position_name if emp.position else "",
                "career_status": emp.career_status,
                "avatar": request.build_absolute_uri(emp.avatar.url) if emp.avatar else '/media/avatar/default_avatar.png',
            })
        return Response(data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        print(f"Data From Front-end: {request.data}")
        if  serializer.is_valid():
            print("Data Valid!")
            self.perform_create(serializer)
            # print(f"Serializer Data: {serializer.data}")
            return Response({
                "message": "Employee created successfully.",
                # "employee": serializer.data
            }, status=status.HTTP_201_CREATED)
            
        print(serializer.errors)
        return Response({
            "message": "Employee creation failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
class EmployeeDetailedView(generics.RetrieveUpdateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    lookup_field = 'id'  # default, but you can customize (e.g. 'id', 'uuid')

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        print(f"Update Request Data: {request.data}")
        
        if serializer.is_valid():
            print("Valid Update!")
            self.perform_update(serializer)
            return Response({
                "message": "Employee updated successfully.",
                "employee": serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            "message": "Employee update failed.",
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
    
class DepartmentPositionListView(APIView):
    def get(self, request, *args, **kwargs):
        department_name = request.query_params.get("department_name")
        if not department_name:
            return Response({"error": "department_name is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            department = Department.objects.get(id=department_name)
        except Department.DoesNotExist:
            return Response({"error": "Department not found."}, status=status.HTTP_404_NOT_FOUND)

        positions = Position.objects.filter(department=department)
        serialized = PositionSerializer(positions, many=True)
        return Response({
            "department_name": department.department_name,
            "positions": serialized.data
        }, status=status.HTTP_200_OK)

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


class TotalLeaveDetailView(generics.RetrieveUpdateAPIView):
    queryset = TotalLeave.objects.all()
    serializer_class = TotalLeaveSerializer

    


from django.shortcuts import get_object_or_404
from rest_framework import generics, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .models import Employee, Department, Position, Shift, Incentive, TotalLeave
from .serializers import ( 
    EmployeeSerializer, 
    DepartmentSerializer, 
    DepartmentCreateSerializer,
    PositionSerializer, 
    ShiftSerializer,
    IncentiveSerializer,
    TotalLeaveSerializer,
    EmployeeUserSerializer,
    LeaveCreateSerializer
)

from user.permissions import HasCustomPermission

class EmployeeListCreateView(generics.ListCreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [HasCustomPermission]
    permission_classes[0].required_permissions = ['can_create_employee']

    def get_queryset(self):
        user = self.request.user
        if user.company:
            return Employee.objects.filter(user__company=user.company)
        return Employee.objects.none()

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
        serializer = self.get_serializer(data=request.data, context={'request': request})
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
    lookup_field = 'id' 

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

class DepartmentListCreateView(generics.ListAPIView):
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return departments under the current user's company
        return Department.objects.filter(company=self.request.user.company)

class DepartmentCreateView(generics.CreateAPIView):
    serializer_class = DepartmentCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user_company = self.request.user.company
        if not user_company:
            raise serializers.ValidationError("User does not belong to any company.")
        serializer.save(company=user_company)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        print(f"Data from front-end: {request.data}")
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                "message": "Department created successfully.",
                "department": serializer.data
            }, status=status.HTTP_201_CREATED)

        print("Validation errors:", serializer.errors)
        return Response({
            "message": "Department creation failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
class DepartmentPositionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        department_id = request.query_params.get("department_name")  # This is actually an ID, not a name

        if not department_id:
            return Response({"error": "department_name (ID) is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Ensure the department belongs to the user's company
            department = Department.objects.get(id=department_id, company=request.user.company)
        except Department.DoesNotExist:
            return Response({"error": "Department not found in your company."}, status=status.HTTP_404_NOT_FOUND)

        # Get positions within the department
        positions = Position.objects.filter(department=department)
        serialized = PositionSerializer(positions, many=True)

        return Response({
            "department_name": department.department_name,
            "positions": serialized.data
        }, status=status.HTTP_200_OK)

class PositionListCreateView(generics.ListCreateAPIView):
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return only positions under the user's company
        return Position.objects.filter(department__company=self.request.user.company)

    def perform_create(self, serializer):
        department_name = self.request.data.get('department')
        if not department_name:
            raise serializers.ValidationError({"department": "This field is required."})

        try:
            # Ensure the department belongs to the user's company
            department = Department.objects.get(
                department_name=department_name,
                company=self.request.user.company
            )
        except Department.DoesNotExist:
            raise serializers.ValidationError({"department": "Department not found or does not belong to your company."})

        serializer.save(department=department)

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
    serializer_class = ShiftSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return shifts from the user's company
        return Shift.objects.filter(company=self.request.user.company)

    def perform_create(self, serializer):
        # Automatically assign the user's company
        serializer.save(company=self.request.user.company)

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
    serializer_class = IncentiveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return Incentives from the user's company
        return Incentive.objects.filter(company=self.request.user.company)

    def perform_create(self, serializer):
        # Automatically assign the user's company
        serializer.save(company=self.request.user.company)

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

class TotalLeaveCreateView(generics.CreateAPIView):
    serializer_class = LeaveCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Company-wide leave created successfully.",
                "total_leave": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "message": "Creation failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class TotalLeaveDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = TotalLeaveSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return TotalLeave.objects.filter(company=self.request.user.company)

    def get_object(self):
        return get_object_or_404(TotalLeave, company=self.request.user.company)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        return super().update(request, *args, **kwargs)


    


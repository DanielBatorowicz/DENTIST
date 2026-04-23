import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestHealth:
    def test_api_root(self):
        r = requests.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert "message" in r.json()


class TestAppointments:
    """Appointment CRUD tests"""

    def test_create_appointment(self):
        payload = {
            "name": "TEST_John Doe",
            "email": "test@example.com",
            "phone": "+44 7000 000000",
            "service": "Teeth Whitening",
            "preferred_date": "2026-03-15",
            "preferred_time": "10:00 AM",
            "message": "Test appointment"
        }
        r = requests.post(f"{BASE_URL}/api/appointments", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert "id" in data
        assert "message" in data
        assert isinstance(data["id"], str)
        # Store id for next test
        TestAppointments.created_id = data["id"]

    def test_get_appointments(self):
        r = requests.get(f"{BASE_URL}/api/appointments")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)

    def test_create_appointment_missing_required(self):
        # Missing phone field
        payload = {
            "name": "TEST_Jane",
            "email": "jane@example.com",
            "service": "General Dentistry"
        }
        r = requests.post(f"{BASE_URL}/api/appointments", json=payload)
        assert r.status_code == 422  # Validation error

    def test_appointment_persisted(self):
        payload = {
            "name": "TEST_Persist Check",
            "email": "persist@example.com",
            "phone": "+44 7111 111111",
            "service": "Dental Implants",
            "preferred_date": "2026-04-01",
            "preferred_time": "2:00 PM",
            "message": ""
        }
        r = requests.post(f"{BASE_URL}/api/appointments", json=payload)
        assert r.status_code == 200
        created_id = r.json()["id"]

        # Verify persistence
        r2 = requests.get(f"{BASE_URL}/api/appointments")
        assert r2.status_code == 200
        ids = [a["id"] for a in r2.json()]
        assert created_id in ids

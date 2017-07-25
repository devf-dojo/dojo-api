import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("devf-dojo-admin-firebase-adminsdk-gpnzx-28a60657ea.json")
firebase_admin.initialize_app(cred)
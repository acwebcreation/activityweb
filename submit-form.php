<?php
// ═══════════════════════════════════════════════════
// submit-form.php — ActivityWeb
// Reçoit le formulaire et enregistre dans Systeme.io
// ═══════════════════════════════════════════════════

// ── Ta clé API Systeme.io ──────────────────────────
$API_KEY = 'COLLE-TA-CLE-API-SYSTEME.IO-ICI';

// ── URLs de redirection ────────────────────────────
$URL_MERCI  = 'https://www.activityweb.be/merci.html';
$URL_ERREUR = 'https://www.activityweb.be/page-capture-leadmagnet.html?erreur=1';

// ── Sécurité : accepter uniquement les POST ────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . $URL_ERREUR);
    exit;
}

// ── Récupérer et nettoyer les données ──────────────
$email     = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$prenom    = htmlspecialchars(trim($_POST['prenom'] ?? ''), ENT_QUOTES, 'UTF-8');

if (!$email) {
    header('Location: ' . $URL_ERREUR);
    exit;
}

// ── Envoyer à l'API Systeme.io ─────────────────────
$data = json_encode([
    'email'     => $email,
    'firstName' => $prenom,
    'fields'    => [],
    'tags'      => ['starter-kit-ia', 'bien-etre']
]);

$ch = curl_init('https://api.systeme.io/api/contacts');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $data,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'X-API-Key: ' . $API_KEY,
    ],
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_SSL_VERIFYPEER => true,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// ── Redirection selon le résultat ─────────────────
// 200 = contact créé, 409 = email déjà existant (ok aussi)
if ($httpCode === 200 || $httpCode === 201 || $httpCode === 409) {
    header('Location: ' . $URL_MERCI);
} else {
    header('Location: ' . $URL_ERREUR);
}
exit;

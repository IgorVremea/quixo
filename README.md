# ‼️Pornirea proiectului‼️
După ce îl descărcați în consola screți:

```bash
npx serve
```

<br>
<hr>

# 📜Quixo – Regulile complete ale jocului
## 1️⃣Prezentare și pregătire 
Jocul se joacă pe o tablă 5×5 formată din 25 de cuburi de lemn. Fiecare cub are patru fețe goale, o față cu semnul **X** și **o** față cu semnul O. La început, toate cuburile sunt așezate cu fața goală în sus.
## 2️⃣Număr de jucători
- 2 jucători (unul joacă cu X, celălalt cu O)
- sau 4 jucători (în echipe de 2: o echipă X, cealaltă O)
## 3️⃣Scopul jocului
Primul jucător (sau echipă) care formează o linie dreaptă de **cinci cuburi** cu semnul său (orizontală, verticală sau diagonală) câștigă jocul.
## 4️⃣Pregătirea
- Așază cele 25 de cuburi în grila 5×5, toate cu fața goală în sus.
- Decideți cine începe (de obicei prin înțelegere sau aruncare la sorți).
- Jucătorii aleg semnul: unul X, celălalt O.
## 5️⃣Cum se desfășoară un tur
Pe rând, fiecare jucător face următoarele acțiuni (obligatoriu în această ordine):
1. Alege un cub de pe marginea tablei (doar din rândul 1, 5 sau coloana 1, 5). Cubul ales poate fi:
    - gol (față goală în sus), sau
    - deja cu semnul tău (X sau O). Nu poți alege un cub cu semnul adversarului!
1. Rotește cubul astfel încât semnul tău (X sau O) să fie în sus.
1. Împinge cubul înapoi în același rând sau aceeași coloană din care l-ai luat, dar de pe o margine opusă sau adiacentă (nu în aceeași poziție de unde l-ai luat).
    - Când împingi, toate cuburile din linie se deplasează cu o poziție.
    - Cubul din capătul opus iese afară din grilă și devine „împins afară”.
## 6️⃣Important
- Trebuie să împingi linia astfel încât să completezi din nou grila 5×5.
- Cubul împins afară rămâne în afara tablei până la următorul tur (dar de fapt, în Quixo clasic, el devine disponibil pentru următorul jucător dacă e pe margine).
## 7️⃣Sfârșitul jocului
După fiecare mutare, verifică dacă există o linie de cinci cuburi identice (toate X sau toate O) pe orizontală, verticală sau diagonală.

Dacă da → jucătorul care tocmai a mutat anunță victoria și câștigă.
## 8️⃣Remiză
Teoretic posibilă (toate cuburile umplute fără linie de 5), dar rar întâlnită.


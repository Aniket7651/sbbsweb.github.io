
const domain = window.location.hostname; // window.location.hostname; // ------ port -------
const protocol = 'https';

const CSV_URL = `${protocol}://${domain}/docs/cert/Validation_list.csv?v=1.0.3`;

async function generateParticipantCertificate() {
    const { jsPDF } = window.jspdf;

    // Landscape A4 size in pixels
    const doc = new jsPDF({
        orientation: 'portrait',  // 'landscape' for horizontal
        unit: 'px',
        format: 'a4' // for landscape: [1120, 794]
    })

    const userEmail = document.getElementById('emailInput').value.trim().toLowerCase();

    if (!userEmail) {
        alert("Please enter your email!");
        return;
    }

    // Load and parse the CSV file production will be from server 
    // here for testing we are using localhost path

    Papa.parse(CSV_URL, {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function (results) {

            const userFound = results.data.find(row => row.Email.toLowerCase().trim() === userEmail);

            if (!userFound) {
                alert("Your email does not match our records. Please contact to the event organizers or backend team.\
                        \n\nOR\n\nMake sure to enter your email exactly as it appears in the registration form.\
                        \n\nOR\n\nPlease take a screenshot of this alert and share it with the event organizers or backend team.");
                return;
            }

            // TODO: Proceed with certificate generation if name is valid
            // Your template image path
            const backgroundImageUrl = 'imgs/certifi/participation_template.png';

            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = backgroundImageUrl;

            img.onload = function () {
                // Add background image (full page)
                doc.addImage(img, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

                // Name styling
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(25);
                doc.setTextColor(0, 0, 80);

                // Center the name horizontally
                const pageWidth = doc.internal.pageSize.getWidth();
                const textWidth = doc.getTextDimensions(userFound.Name.trim()).w;
                const x = (pageWidth) / 2; // Center horizontally

                // Name vertical position
                const y = 320; // Adjust this value to position the name vertically

                // Add name
                doc.text(userFound.Name.toUpperCase().trim(), x, y, { align: 'center' });

                // Get Affiliation from CSV

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(16);
                doc.setTextColor(0, 0, 80);

                const splitText = doc.splitTextToSize(userFound?.Affiliation || 'N/A', 300);
                const affiliationTextWidth = doc.getTextDimensions(splitText).w;
                const affiliationX = (pageWidth) / 2;
                const affiliationY = y + 40; // Position below the name
                doc.text(splitText, affiliationX, affiliationY, { align: 'center' });

                // Add current date and time in bottom-right corner
                const now = new Date();
                const dateStr = now.toLocaleDateString('en-GB'); // 28/12/2025
                const timeStr = now.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }); // 14:30:25

                const dateTimeText = `${userFound?.uuid || 'N/A'} Date: ${dateStr} ${timeStr}`;

                doc.setFontSize(10);
                doc.setTextColor(80, 80, 80);
                doc.setFont('helvetica', 'normal');

                // Position: right-aligned, 50px from bottom, 40px from right edge
                const dateX = pageWidth - 70;
                const dateY = doc.internal.pageSize.getHeight() - 45;

                doc.text(dateTimeText, dateX, dateY, { align: 'right' });

                // Download the PDF
                doc.save(`Certificate_NCAB_HAFVH_2025_${userFound.Name.replaceAll(" ", "_")}.pdf`);
            };

            img.onerror = function () {
                alert("Image not loaded! Please check that certificate template exists.");
            };

        },
        error: function (err) {
            alert("List of participants does not provided by backend team.")
        }
    })
}




async function generatePresentationCertificate() {
    const { jsPDF } = window.jspdf;

    // Landscape A4 size in pixels
    const doc = new jsPDF({
        orientation: 'portrait',  // 'landscape' for horizontal
        unit: 'px',
        format: 'a4' // for landscape: [1120, 794]
    })
    const userEmail = document.getElementById('emailInput').value.trim().toLowerCase();

    if (!userEmail) {
        alert("Please enter your email!");
        return;
    }

    Papa.parse(CSV_URL, {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function (results) {

            const userFound = results.data.find(row => row.Email.toLowerCase().trim() === userEmail);

            if (!userFound) {
                alert("Your email does not match our records. Please contact to the event organizers or backend team.\
                        \n\nOR\n\nMake sure to enter your email exactly as it appears in the registration form.\
                        \n\nOR\n\nPlease take a screenshot of this alert and share it with the event organizers or backend team.");
                return;
            }

            if (userFound.Mode.trim() === 'Only Participants') {
                alert(`Dear ${userFound.Name}, You're not listed in oral or poster presentation`)
            }

            // TODO: Proceed with certificate generation if name is valid
            // Your template image path

            let backgroundImageUrl = 'imgs/certifi/participation_template.png';
            if (userFound.Mode.trim() === 'Poster Presentation') {
                backgroundImageUrl = 'imgs/certifi/poster_participation_template.png';
            }
            else if (userFound.Mode.trim() === 'Oral Presentation') {
                backgroundImageUrl = 'imgs/certifi/oral_participation_template.png';
            }
            
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = backgroundImageUrl;

            img.onload = function () {
                // Add background image (full page)
                doc.addImage(img, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

                // Name styling
                doc.setFont('Times', 'bold');
                doc.setFontSize(30);
                doc.setTextColor(178, 20, 80);

                // Center the name horizontally
                const pageWidth = doc.internal.pageSize.getWidth();
                const textWidth = doc.getTextDimensions(userFound.Name.trim()).w;
                const x = (pageWidth) / 2; // Center horizontally

                // Name vertical position
                const y = 320; // Adjust this value to position the name vertically

                // Add name
                doc.text(userFound.Name.toUpperCase().trim(), x, y, { align: 'center' });

                // Get Affiliation from CSV

                doc.setFont('Times', 'italic');
                doc.setFontSize(16);
                doc.setTextColor(69, 122, 0);

                const splitText = doc.splitTextToSize(userFound?.Topic.trim() || 'N/A', 300);
                // const affiliationTextWidth = doc.getTextDimensions(splitText).w;
                const affiliationX = (pageWidth) / 2;
                const affiliationY = y + 40; // Position below the name
                doc.text(splitText, affiliationX, affiliationY, { align: 'center' });

                // Add current date and time in bottom-right corner
                const now = new Date();
                const dateStr = now.toLocaleDateString('en-GB'); // 28/12/2025
                const timeStr = now.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }); // 14:30:25

                const dateTimeText = `${userFound?.uuid || 'N/A'} Date: ${dateStr} ${timeStr}`;

                doc.setFontSize(10);
                doc.setTextColor(80, 80, 80);
                doc.setFont('helvetica', 'normal');

                // Position: right-aligned, 50px from bottom, 40px from right edge
                const dateX = pageWidth - 70;
                const dateY = doc.internal.pageSize.getHeight() - 45;

                doc.text(dateTimeText, dateX, dateY, { align: 'right' });

                // Download the PDF
                doc.save(`Presenter_Certificate_NCAB_HAFVH_2025_${userFound.Name.replaceAll(" ", "_")}.pdf`);
            };

            img.onerror = function () {
                alert("Image not loaded! Please check that certificate template exists.");
            };

        },
        error: function (err) {
            alert("List of participants does not provided by backend team.")
        }
    })
}


function initConferenceValidator() {
    let participants = [];

    // Load CSV once on page load
    fetch(CSV_URL)
        .then(response => {
            if (!response.ok) throw new Error('CSV not found');
            return response.text();
        })
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    participants = results.data;
                    hideLoading();
                    focusInput();
                }
            });
        })
        .catch(err => {
            showError('Error loading data: ' + err.message);
        });

    function hideLoading() {
        const loadingEl = document.getElementById('loading');
        if (loadingEl) loadingEl.style.display = 'none';
    }

    function focusInput() {
        const input = document.getElementById('codeInput');
        if (input) input.focus();
    }

    function showError(message) {
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.innerHTML = '<span style="color:red;">' + message + '</span>';
        }
    }

    // Setup input listener
    const input = document.getElementById('codeInput');
    if (!input) {
        console.error('Element with id="codeInput" not found');
        return;
    }

    input.addEventListener('input', function() {
        const code = this.value.trim();
        if (code === '') {
            clearInfo();
            return;
        }
        searchParticipant(code);
    });

    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const code = this.value.trim();
            searchParticipant(code);
        }
    });

    function searchParticipant(code) {
        const participant = participants.find(p => 
            p['uuid'] && p['uuid'].trim() === code
        );

        const infoEl = document.getElementById('info');
        if (!infoEl) return;

        if (participant.Mode === 'Invited Speaker') {
            infoEl.innerHTML = `
                <div style="color:#28a745; font-size:28px; font-weight:bold;">Recognised Speaker</div>
                <div style="margin-top:20px; text-align:left; font-size:18px;">
                    <p><strong>Name:</strong> ${participant.Name || 'N/A'}</p>
                    <p><strong>Email:</strong> ${participant.Email || 'N/A'}</p>
                    <p><strong>Affiliation:</strong> ${participant.Affiliation || 'N/A'}</p>
                    <p><strong>Mode of Participant:</strong> ${participant.Mode || 'N/A'}; <strong>${participant.Committee || ''}</strong></p>
                    <p><strong>Talk:</strong> ${participant.Topic || 'N/A'}</p>
                    <p><strong>Session & Timing of Talk:</strong> ${participant.Session || 'N/A'}, ${participant.Timimg || 'N/A'}</p>
                </div>
            `;
        } else if (participant.Position !== '') {
            infoEl.innerHTML = `
                <div style="color:#28a745; font-size:28px; font-weight:bold;">Recognised Participant & ${participant.Position} Position Winner in ${participant.Mode}</div>
                <div style="margin-top:20px; text-align:left; font-size:18px;">
                    <p><strong>Name:</strong> ${participant.Name || 'N/A'}</p>
                    <p><strong>Email:</strong> ${participant.Email || 'N/A'}</p>
                    <p><strong>Affiliation:</strong> ${participant.Affiliation || 'N/A'}</p>
                    <p><strong>Mode of Participant:</strong> ${participant.Mode || 'N/A'}</p>
                    <p><strong>Topic:</strong> ${participant.Topic || 'N/A'}</p>
                </div>
            `;

        } else if (participant.Mode === 'Only Participants') {
            participant.Mode = 'Only Participant';
            infoEl.innerHTML = `
                <div style="color:#28a745; font-size:28px; font-weight:bold;">Recognised Participant</div>
                <div style="margin-top:20px; text-align:left; font-size:18px;">
                    <p><strong>Name:</strong> ${participant.Name || 'N/A'}</p>
                    <p><strong>Email:</strong> ${participant.Email || 'N/A'}</p>
                    <p><strong>Affiliation:</strong> ${participant.Affiliation || 'N/A'}</p>
                    <p><strong>Mode of Participant:</strong> ${participant.Mode || 'N/A'}; <strong>${participant.Committee || ''}</strong></p>
                    <p><strong>Topic:</strong> ${participant.Topic || 'Only attendee; he has no topic to present as oral or poster.'} </p>
                </div>
            `;
        }
        else if (participant.Mode === 'Poster Presentation' || participant.Mode === 'Oral Presentation') {
            infoEl.innerHTML = `
                <div style="color:#28a745; font-size:28px; font-weight:bold;">Recognised Presenter</div>
                <div style="margin-top:20px; text-align:left; font-size:18px;">
                    <p><strong>Name:</strong> ${participant.Name || 'N/A'}</p>
                    <p><strong>Email:</strong> ${participant.Email || 'N/A'}</p>
                    <p><strong>Affiliation:</strong> ${participant.Affiliation || 'N/A'}</p>
                    <p><strong>Mode of Participant:</strong> ${participant.Mode || 'N/A'}; <strong>${participant.Committee || ''}</strong></p>
                    <p><strong>Topic:</strong> ${participant.Topic || 'N/A'}</p>
                </div>
            `;
        } else {
            infoEl.innerHTML = `
                <div style="color:#dc3545; font-size:28px; font-weight:bold;">Invalid ID provided.Invalid Code provided.</div>
                <div style="margin-top:20px;">Invalid or unknown code: ${code}</div>
            `;
        }
    }

    function clearInfo() {
        const infoEl = document.getElementById('info');
        if (infoEl) infoEl.innerHTML = '';
    }
}

// Call this function when you want to start the validator (e.g., on page load)
// initParticipantValidator();
initConferenceValidator();
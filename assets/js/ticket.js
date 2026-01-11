document.getElementById("downloadImg").addEventListener("click", (e) => {
    e.preventDefault();
    downloadTicketImage();   
});

function downloadTicketImage() {
    const ticket = document.getElementById("ticketDiv");

    html2canvas(ticket, {
        scale: 2,         
        useCORS: true,   
        backgroundColor: "#ffffff"
    }).then(canvas => {

        const imgData = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = imgData;
        link.download = "Train_Ticket.png";

        link.click();
    });
}

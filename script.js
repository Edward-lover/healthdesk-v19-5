// ============================================================
// HEALTHDESK
// MAIN JAVASCRIPT
// SUPABASE VERSION
// ============================================================


// ============================================================
// SUPABASE CONNECTION
// ============================================================

const SUPABASE_URL =
    "https://ysszhrzgpmicplkfnlhf.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_GgPrbdBEHLodC2hubWr1NQ_KNoBClNr";

let supabaseClient = null;

if (window.supabase) {

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );

} else {

    console.error(
        "Supabase library was not loaded."
    );

}


// ============================================================
// HELPER FUNCTIONS
// ============================================================

function showMessage(
    element,
    message,
    type = "error"
) {

    if (!element) return;

    element.textContent = message;
    element.style.display = "block";

    if (type === "success") {

        element.style.color = "#16a34a";

    } else {

        element.style.color = "#dc2626";

    }

}


function hideMessage(element) {

    if (!element) return;

    element.textContent = "";
    element.style.display = "none";

}


function getCurrentPage() {

    return window.location.pathname
        .split("/")
        .pop();

}


// ============================================================
// LOGIN / SIGN UP SECTION SWITCHING
// ============================================================

const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const loginSection =
    document.getElementById("loginSection");

const signupSection =
    document.getElementById("signupSection");

const showSignup =
    document.getElementById("showSignup");

const showLogin =
    document.getElementById("showLogin");


if (showSignup) {

    showSignup.addEventListener(
        "click",
        function () {

            if (loginSection) {

                loginSection.classList.add(
                    "hidden"
                );

            }

            if (signupSection) {

                signupSection.classList.remove(
                    "hidden"
                );

            }

        }
    );

}


if (showLogin) {

    showLogin.addEventListener(
        "click",
        function () {

            if (signupSection) {

                signupSection.classList.add(
                    "hidden"
                );

            }

            if (loginSection) {

                loginSection.classList.remove(
                    "hidden"
                );

            }

        }
    );

}


// ============================================================
// USER SIGN UP
// ============================================================

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const firstName =
                document.getElementById(
                    "signupFirstName"
                )?.value.trim();

            const lastName =
                document.getElementById(
                    "signupLastName"
                )?.value.trim();

            const studentId =
                document.getElementById(
                    "signupStudentId"
                )?.value.trim();

            const email =
                document.getElementById(
                    "signupEmail"
                )?.value.trim();

            const username =
                document.getElementById(
                    "signupUsername"
                )?.value.trim();

            const password =
                document.getElementById(
                    "signupPassword"
                )?.value;

            const confirmPassword =
                document.getElementById(
                    "signupConfirmPassword"
                )?.value;

            const signupMessage =
                document.getElementById(
                    "signupMessage"
                );


            hideMessage(signupMessage);


            if (
                !firstName ||
                !lastName ||
                !studentId ||
                !email ||
                !username ||
                !password ||
                !confirmPassword
            ) {

                showMessage(
                    signupMessage,
                    "Please complete all required fields."
                );

                return;

            }


            if (!email.includes("@")) {

                showMessage(
                    signupMessage,
                    "Please enter a valid email address."
                );

                return;

            }


            if (password.length < 6) {

                showMessage(
                    signupMessage,
                    "Password must be at least 6 characters."
                );

                return;

            }


            if (password !== confirmPassword) {

                showMessage(
                    signupMessage,
                    "Passwords do not match."
                );

                return;

            }


            if (!supabaseClient) {

                showMessage(
                    signupMessage,
                    "HealthDesk could not connect to Supabase."
                );

                return;

            }


            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth.signUp({

                        email: email,

                        password: password,

                        options: {

                            data: {

                                first_name:
                                    firstName,

                                last_name:
                                    lastName,

                                student_id:
                                    studentId,

                                username:
                                    username

                            }

                        }

                    });


                if (error) {

                    console.error(
                        "Signup error:",
                        error
                    );

                    showMessage(
                        signupMessage,
                        error.message
                    );

                    return;

                }


                console.log(
                    "Supabase user created:",
                    data.user
                );


                showMessage(
                    signupMessage,
                    "Account created successfully! You can now log in.",
                    "success"
                );


                signupForm.reset();


            }
            catch (error) {

                console.error(
                    "Unexpected signup error:",
                    error
                );

                showMessage(
                    signupMessage,
                    "Something went wrong. Please try again."
                );

            }

        }
    );

}


// ============================================================
// USER LOGIN
// ============================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                document.getElementById(
                    "loginUsername"
                )?.value.trim();

            const password =
                document.getElementById(
                    "loginPassword"
                )?.value;

            const loginMessage =
                document.getElementById(
                    "loginMessage"
                );


            hideMessage(loginMessage);


            if (!username || !password) {

                showMessage(
                    loginMessage,
                    "Please enter your username and password."
                );

                return;

            }


            if (!supabaseClient) {

                showMessage(
                    loginMessage,
                    "HealthDesk could not connect to Supabase."
                );

                return;

            }


            try {

                const {
                    data: emailData,
                    error: usernameError
                } =
                    await supabaseClient.rpc(
                        "get_login_email",
                        {
                            p_username: username
                        }
                    );


                if (usernameError) {

                    console.error(
                        "Username lookup error:",
                        usernameError
                    );

                    showMessage(
                        loginMessage,
                        "Unable to find your account."
                    );

                    return;

                }


                if (!emailData) {

                    showMessage(
                        loginMessage,
                        "Incorrect username or password."
                    );

                    return;

                }


                const {
                    data,
                    error
                } =
                    await supabaseClient.auth
                        .signInWithPassword({

                            email:
                                emailData,

                            password:
                                password

                        });


                if (error) {

                    console.error(
                        "LOGIN ERROR:",
                        error
                    );

                    showMessage(
                        loginMessage,
                        "Incorrect username or password."
                    );

                    return;

                }


                console.log(
                    "Login successful:",
                    data.user
                );


                window.location.href =
                    "dashboard.html";

            }
            catch (error) {

                console.error(
                    "Unexpected login error:",
                    error
                );

                showMessage(
                    loginMessage,
                    "Unexpected login error: " +
                    error.message
                );

            }

        }
    );

}


// ============================================================
// GET CURRENT AUTHENTICATED USER
// ============================================================

async function getCurrentUser() {

    if (!supabaseClient) {

        return null;

    }


    const {
        data,
        error
    } =
        await supabaseClient.auth.getUser();


    if (error) {

        return null;

    }


    return data.user || null;

}


// ============================================================
// GET USER PROFILE
// ============================================================

async function getUserProfile() {

    const authUser =
        await getCurrentUser();


    if (!authUser) {

        return null;

    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("users")
            .select("*")
            .eq(
                "id",
                authUser.id
            )
            .maybeSingle();


    if (error) {

        console.error(
            "Profile error:",
            error
        );

        return null;

    }


    return data;

}


// ============================================================
// USER PAGE PROTECTION
// ============================================================

async function protectUserPage() {

    const currentPage =
        getCurrentPage();


    const protectedPages = [

        "dashboard.html",
        "appointment.html",
        "appointments.html"

    ];


    if (
        !protectedPages.includes(
            currentPage
        )
    ) {

        return;

    }


    const user =
        await getCurrentUser();


    if (!user) {

        window.location.href =
            "index.html";

    }

}


protectUserPage();


// ============================================================
// USER LOGOUT
// ============================================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            if (supabaseClient) {

                await supabaseClient.auth
                    .signOut();

            }


            window.location.href =
                "index.html";

        }
    );

}


// ============================================================
// DASHBOARD
// ============================================================

const welcomeMessage =
    document.getElementById(
        "welcomeMessage"
    );

const studentNameDisplay =
    document.getElementById(
        "studentNameDisplay"
    );

const totalAppointments =
    document.getElementById(
        "totalAppointments"
    );

const pendingAppointments =
    document.getElementById(
        "pendingAppointments"
    );

const nextAppointment =
    document.getElementById(
        "nextAppointment"
    );


async function loadDashboard() {

    const user =
        await getCurrentUser();


    if (!user) {

        window.location.href =
            "index.html";

        return;

    }


    const profile =
        await getUserProfile();


    if (!profile) {

        return;

    }


    const fullName =
        (
            profile.first_name +
            " " +
            profile.last_name
        ).trim();


    if (welcomeMessage) {

        welcomeMessage.textContent =
            "Welcome, " +
            fullName +
            " 👋";

    }


    if (studentNameDisplay) {

        studentNameDisplay.textContent =
            fullName;

    }


    const {
        data: appointments,
        error
    } =
        await supabaseClient
            .from("appointments")
            .select("*")
            .eq(
                "user_id",
                user.id
            )
            .order(
                "appointment_date",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Appointment loading error:",
            error
        );

        return;

    }


    const appointmentData =
        appointments || [];


    if (totalAppointments) {

        totalAppointments.textContent =
            appointmentData.length;

    }


    if (pendingAppointments) {

        pendingAppointments.textContent =
            appointmentData.filter(
                appointment =>
                    appointment.status ===
                    "Pending"
            ).length;

    }


    if (!nextAppointment) {

        return;

    }


    if (appointmentData.length === 0) {

        nextAppointment.innerHTML = `

            <div class="empty-dashboard">

                <span>📅</span>

                <p>
                    You don't have any appointments yet.
                </p>

                <a
                    href="appointment.html"
                    class="btn primary-btn">

                    Book Appointment

                </a>

            </div>

        `;

        return;

    }


    const upcoming =
        appointmentData
            .filter(
                appointment =>

                    appointment.status !==
                    "Rejected" &&

                    appointment.status !==
                    "Completed"
            )
            .sort(
                (a, b) =>

                    new Date(
                        a.appointment_date +
                        "T" +
                        a.appointment_time
                    ) -

                    new Date(
                        b.appointment_date +
                        "T" +
                        b.appointment_time
                    )
            )[0];


    if (!upcoming) {

        nextAppointment.innerHTML = `

            <div class="empty-dashboard">

                <span>✅</span>

                <p>
                    No upcoming appointments.
                </p>

            </div>

        `;

        return;

    }


    nextAppointment.innerHTML = `

        <div class="next-card">

            <div class="next-card-header">

                <h3>
                    Clinic Appointment
                </h3>

                <span class="next-status">
                    ${upcoming.status}
                </span>

            </div>

            <div class="next-details">

                <p>
                    Date
                    <strong>
                        ${upcoming.appointment_date}
                    </strong>
                </p>

                <p>
                    Time
                    <strong>
                        ${upcoming.appointment_time}
                    </strong>
                </p>

                <p>
                    Reason
                    <strong>
                        ${upcoming.reason}
                    </strong>
                </p>

            </div>

        </div>

    `;

}


if (
    getCurrentPage() ===
    "dashboard.html"
) {

    loadDashboard();

}


// ============================================================
// APPOINTMENT FORM
// ============================================================

const appointmentForm =
    document.getElementById(
        "appointmentForm"
    );


if (appointmentForm) {

    appointmentForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const user =
                await getCurrentUser();


            if (!user) {

                window.location.href =
                    "index.html";

                return;

            }


            const appointmentType =
                document.getElementById(
                    "appointmentType"
                )?.value ||
                "Public";


            const date =
                document.getElementById(
                    "appointmentDate"
                )?.value;


            const time =
                document.getElementById(
                    "appointmentTime"
                )?.value;


            const reason =
                document.getElementById(
                    "appointmentReason"
                )?.value.trim();


            if (
                !date ||
                !time ||
                !reason
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            try {

                const {
                    error
                } =
                    await supabaseClient
                        .from("appointments")
                        .insert({

                            user_id:
                                user.id,

                            appointment_type:
                                appointmentType,

                            appointment_date:
                                date,

                            appointment_time:
                                time,

                            reason:
                                reason,

                            status:
                                "Pending"

                        });


                if (error) {

                    console.error(
                        "Appointment error:",
                        error
                    );

                    alert(
                        "Unable to submit appointment. Please try again."
                    );

                    return;

                }


                alert(
                    "Appointment submitted successfully!"
                );


                window.location.href =
                    "appointments.html";

            }
            catch (error) {

                console.error(
                    "Unexpected appointment error:",
                    error
                );

                alert(
                    "Something went wrong. Please try again."
                );

            }

        }
    );

}


// ============================================================
// MY APPOINTMENTS
// ============================================================

const appointmentsList =
    document.getElementById(
        "appointmentsList"
    );


async function loadAppointments() {

    if (!appointmentsList) {

        return;

    }


    const user =
        await getCurrentUser();


    if (!user) {

        window.location.href =
            "index.html";

        return;

    }


    const {
        data: appointments,
        error
    } =
        await supabaseClient
            .from("appointments")
            .select("*")
            .eq(
                "user_id",
                user.id
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Appointments error:",
            error
        );

        appointmentsList.innerHTML = `

            <div class="empty-state">

                <h2>
                    Unable to Load Appointments
                </h2>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

        return;

    }


    const appointmentData =
        appointments || [];


    if (
        appointmentData.length ===
        0
    ) {

        appointmentsList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📅
                </div>

                <h2>
                    No Appointments
                </h2>

                <p>
                    You don't have any clinic appointments yet.
                </p>

                <a
                    href="appointment.html"
                    class="btn primary-btn">

                    Book Appointment

                </a>

            </div>

        `;

        return;

    }


    appointmentsList.innerHTML = "";


    appointmentData.forEach(
        appointment => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "appointment-card";


            const statusClass =
                String(
                    appointment.status ||
                    "Pending"
                ).toLowerCase();


            card.innerHTML = `

                <div class="appointment-header">

                    <h2>
                        Clinic Appointment
                    </h2>

                    <span
                        class="appointment-status status-${statusClass}">

                        ${appointment.status}

                    </span>

                </div>


                <div class="appointment-details">

                    <p>
                        <strong>
                            Type:
                        </strong>

                        ${appointment.appointment_type}
                    </p>


                    <p>
                        <strong>
                            Date:
                        </strong>

                        ${appointment.appointment_date}
                    </p>


                    <p>
                        <strong>
                            Time:
                        </strong>

                        ${appointment.appointment_time}
                    </p>


                    <p>
                        <strong>
                            Reason:
                        </strong>

                        ${appointment.reason}
                    </p>

                </div>


                ${
                    appointment.status ===
                    "Pending"

                    ? `

                        <button
                            class="cancel-btn"
                            onclick="cancelAppointment('${appointment.id}')">

                            Cancel Appointment

                        </button>

                    `

                    : ""

                }

            `;


            appointmentsList.appendChild(
                card
            );

        }
    );

}


async function cancelAppointment(
    appointmentId
) {

    const confirmed =
        confirm(
            "Are you sure you want to cancel this appointment?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("appointments")
                .update({

                    status:
                        "Rejected"

                })
                .eq(
                    "id",
                    appointmentId
                );


        if (error) {

            console.error(
                "Cancel appointment error:",
                error
            );

            alert(
                "Unable to cancel appointment."
            );

            return;

        }


        loadAppointments();

    }
    catch (error) {

        console.error(
            "Unexpected cancellation error:",
            error
        );

        alert(
            "Something went wrong."
        );

    }

}


window.cancelAppointment =
    cancelAppointment;


if (
    getCurrentPage() ===
    "appointments.html"
) {

    loadAppointments();

}


// ============================================================
// ADMIN LOGIN
// ============================================================

const adminLoginForm =
    document.getElementById(
        "adminLoginForm"
    );


if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const emailInput =
                document.getElementById(
                    "adminEmail"
                );

            const passwordInput =
                document.getElementById(
                    "adminPassword"
                );

            const adminLoginMessage =
                document.getElementById(
                    "adminLoginMessage"
                );


            const email =
                emailInput?.value
                    .trim()
                    .toLowerCase();

            const password =
                passwordInput?.value;


            hideMessage(
                adminLoginMessage
            );


            if (!email || !password) {

                showMessage(
                    adminLoginMessage,
                    "Please enter your email and password."
                );

                return;

            }


            if (!supabaseClient) {

                showMessage(
                    adminLoginMessage,
                    "HealthDesk could not connect to Supabase."
                );

                return;

            }


            console.log(
                "ADMIN LOGIN START:",
                email
            );


            try {

                // ------------------------------------------------
                // STEP 1
                // AUTH LOGIN
                // ------------------------------------------------

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth
                        .signInWithPassword({

                            email:
                                email,

                            password:
                                password

                        });


                if (error) {

                    console.error(
                        "ADMIN AUTH ERROR:",
                        error
                    );

                    showMessage(
                        adminLoginMessage,
                        "Incorrect administrator email or password."
                    );

                    return;

                }


                if (
                    !data ||
                    !data.user
                ) {

                    showMessage(
                        adminLoginMessage,
                        "Administrator login failed."
                    );

                    return;

                }


                const authUser =
                    data.user;


                console.log(
                    "ADMIN AUTHENTICATED"
                );

                console.log(
                    "AUTH USER ID:",
                    authUser.id
                );

                console.log(
                    "AUTH EMAIL:",
                    authUser.email
                );


                // ------------------------------------------------
                // STEP 2
                // FIND ADMIN BY AUTH ID
                // ------------------------------------------------

                let admin = null;

                let adminError = null;


                const adminById =
                    await supabaseClient
                        .from("admins")
                        .select(
                            "id, username, email, status"
                        )
                        .eq(
                            "id",
                            authUser.id
                        )
                        .maybeSingle();


                admin =
                    adminById.data;

                adminError =
                    adminById.error;


                console.log(
                    "ADMIN SEARCH BY ID:",
                    admin
                );


                // ------------------------------------------------
                // STEP 3
                // IF ID DID NOT FIND ADMIN,
                // SEARCH USING EMAIL
                // ------------------------------------------------

                if (
                    !admin &&
                    !adminError
                ) {

                    console.log(
                        "No admin found by ID. Checking email..."
                    );


                    const adminByEmail =
                        await supabaseClient
                            .from("admins")
                            .select(
                                "id, username, email, status"
                            )
                            .ilike(
                                "email",
                                authUser.email
                            )
                            .maybeSingle();


                    admin =
                        adminByEmail.data;

                    adminError =
                        adminByEmail.error;


                    console.log(
                        "ADMIN SEARCH BY EMAIL:",
                        admin
                    );

                }


                // ------------------------------------------------
                // STEP 4
                // DATABASE ERROR
                // ------------------------------------------------

                if (adminError) {

                    console.error(
                        "ADMIN TABLE ERROR:",
                        adminError
                    );


                    await supabaseClient.auth
                        .signOut();


                    showMessage(
                        adminLoginMessage,
                        "Administrator login worked, but HealthDesk could not verify the administrator account."
                    );

                    return;

                }


                // ------------------------------------------------
                // STEP 5
                // NO ADMIN ACCOUNT
                // ------------------------------------------------

                if (!admin) {

                    console.error(
                        "NO ADMIN ACCOUNT FOUND"
                    );


                    console.error(
                        "AUTH ID:",
                        authUser.id
                    );


                    console.error(
                        "AUTH EMAIL:",
                        authUser.email
                    );


                    await supabaseClient.auth
                        .signOut();


                    showMessage(
                        adminLoginMessage,
                        "This account does not have administrator access."
                    );

                    return;

                }


                // ------------------------------------------------
                // STEP 6
                // CHECK ADMIN STATUS
                // ------------------------------------------------

                console.log(
                    "ADMIN RECORD FOUND:",
                    admin
                );


                if (
                    admin.status &&
                    admin.status.toLowerCase() !==
                    "active"
                ) {

                    await supabaseClient.auth
                        .signOut();


                    showMessage(
                        adminLoginMessage,
                        "This administrator account is not active."
                    );

                    return;

                }


                // ------------------------------------------------
                // STEP 7
                // ADMIN LOGIN SUCCESS
                // ------------------------------------------------

                console.log(
                    "================================"
                );

                console.log(
                    "ADMIN LOGIN SUCCESSFUL"
                );

                console.log(
                    "ADMIN ID:",
                    admin.id
                );

                console.log(
                    "ADMIN EMAIL:",
                    admin.email
                );

                console.log(
                    "ADMIN STATUS:",
                    admin.status
                );

                console.log(
                    "================================"
                );


                window.location.replace(
                    "admin.html"
                );

            }
            catch (error) {

                console.error(
                    "UNEXPECTED ADMIN LOGIN ERROR:",
                    error
                );


                await supabaseClient.auth
                    .signOut();


                showMessage(
                    adminLoginMessage,
                    "Unexpected administrator login error: " +
                    error.message
                );

            }

        }
    );

}


// ============================================================
// ADMIN PAGE PROTECTION
// ============================================================

async function protectAdminPage() {

    const currentPage =
        getCurrentPage();


    if (
        currentPage !==
        "admin.html"
    ) {

        return;

    }


    if (!supabaseClient) {

        window.location.replace(
            "admin-login.html"
        );

        return;

    }


    const user =
        await getCurrentUser();


    if (!user) {

        window.location.replace(
            "admin-login.html"
        );

        return;

    }


    // --------------------------------------------------------
    // CHECK ADMIN BY ID
    // --------------------------------------------------------

    let admin = null;

    let error = null;


    const adminById =
        await supabaseClient
            .from("admins")
            .select(
                "id, status, email"
            )
            .eq(
                "id",
                user.id
            )
            .maybeSingle();


    admin =
        adminById.data;

    error =
        adminById.error;


    // --------------------------------------------------------
    // CHECK ADMIN BY EMAIL IF NECESSARY
    // --------------------------------------------------------

    if (
        !admin &&
        !error
    ) {

        const adminByEmail =
            await supabaseClient
                .from("admins")
                .select(
                    "id, status, email"
                )
                .ilike(
                    "email",
                    user.email
                )
                .maybeSingle();


        admin =
            adminByEmail.data;

        error =
            adminByEmail.error;

    }


    if (
        error ||
        !admin
    ) {

        console.error(
            "Admin verification failed:",
            error
        );


        await supabaseClient.auth
            .signOut();


        window.location.replace(
            "admin-login.html"
        );

        return;

    }


    if (
        admin.status &&
        admin.status.toLowerCase() !==
        "active"
    ) {

        await supabaseClient.auth
            .signOut();


        window.location.replace(
            "admin-login.html"
        );

        return;

    }

}


protectAdminPage();


// ============================================================
// ADMIN LOGOUT
// ============================================================

const adminLogoutBtn =
    document.getElementById(
        "adminLogoutBtn"
    );


if (adminLogoutBtn) {

    adminLogoutBtn.addEventListener(
        "click",
        async function () {

            if (supabaseClient) {

                await supabaseClient.auth
                    .signOut();

            }


            window.location.replace(
                "admin-login.html"
            );

        }
    );

}


// ============================================================
// ADMIN DASHBOARD
// ============================================================

const adminTotal =
    document.getElementById(
        "adminTotal"
    );

const adminPending =
    document.getElementById(
        "adminPending"
    );

const adminApproved =
    document.getElementById(
        "adminApproved"
    );

const adminAppointments =
    document.getElementById(
        "adminAppointments"
    );


async function loadAdminDashboard() {

    if (
        getCurrentPage() !==
        "admin.html"
    ) {

        return;

    }


    if (!adminAppointments) {

        console.error(
            "adminAppointments element was not found in admin.html."
        );

        return;

    }


    const user =
        await getCurrentUser();


    if (!user) {

        window.location.replace(
            "admin-login.html"
        );

        return;

    }


    // --------------------------------------------------------
    // VERIFY ADMIN
    // --------------------------------------------------------

    let admin = null;

    let adminCheckError = null;


    const adminById =
        await supabaseClient
            .from("admins")
            .select(
                "id,status,email"
            )
            .eq(
                "id",
                user.id
            )
            .maybeSingle();


    admin =
        adminById.data;

    adminCheckError =
        adminById.error;


    if (
        !admin &&
        !adminCheckError
    ) {

        const adminByEmail =
            await supabaseClient
                .from("admins")
                .select(
                    "id,status,email"
                )
                .ilike(
                    "email",
                    user.email
                )
                .maybeSingle();


        admin =
            adminByEmail.data;

        adminCheckError =
            adminByEmail.error;

    }


    if (
        adminCheckError ||
        !admin
    ) {

        console.error(
            "Admin verification error:",
            adminCheckError
        );

        window.location.replace(
            "admin-login.html"
        );

        return;

    }


    if (
        admin.status &&
        admin.status.toLowerCase() !==
        "active"
    ) {

        window.location.replace(
            "admin-login.html"
        );

        return;

    }


    // --------------------------------------------------------
    // LOAD APPOINTMENTS
    // --------------------------------------------------------

    const {
        data: appointments,
        error
    } =
        await supabaseClient
            .from("appointments")
            .select(`
                *,
                users (
                    first_name,
                    last_name,
                    student_id,
                    email
                )
            `)
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Admin appointments error:",
            error
        );

        adminAppointments.innerHTML = `

            <div class="empty-state">

                <h2>
                    Unable to Load Appointments
                </h2>

                <p>
                    ${error.message}
                </p>

            </div>

        `;

        return;

    }


    const appointmentData =
        appointments || [];


    if (adminTotal) {

        adminTotal.textContent =
            appointmentData.length;

    }


    if (adminPending) {

        adminPending.textContent =
            appointmentData.filter(
                appointment =>
                    appointment.status ===
                    "Pending"
            ).length;

    }


    if (adminApproved) {

        adminApproved.textContent =
            appointmentData.filter(
                appointment =>
                    appointment.status ===
                    "Approved"
            ).length;

    }


    if (
        appointmentData.length ===
        0
    ) {

        adminAppointments.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📅
                </div>

                <h2>
                    No Appointments
                </h2>

                <p>
                    There are no student appointments yet.
                </p>

            </div>

        `;

        return;

    }


    adminAppointments.innerHTML = "";


    appointmentData.forEach(
        appointment => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "admin-appointment";


            const student =
                appointment.users ||
                {};


            const studentName =
                (
                    (
                        student.first_name ||
                        ""
                    ) +
                    " " +
                    (
                        student.last_name ||
                        ""
                    )
                ).trim() ||
                "Unknown Student";


            const statusClass =
                String(
                    appointment.status ||
                    "Pending"
                ).toLowerCase();


            card.innerHTML = `

                <div class="admin-appointment-header">

                    <h3>
                        ${studentName}
                    </h3>

                    <span
                        class="admin-status status-${statusClass}">

                        ${appointment.status}

                    </span>

                </div>


                <div class="admin-details">

                    <strong>
                        Student ID:
                    </strong>

                    ${student.student_id || "N/A"}

                    <br>

                    <strong>
                        Email:
                    </strong>

                    ${student.email || "N/A"}

                    <br>

                    <strong>
                        Type:
                    </strong>

                    ${appointment.appointment_type}

                    <br>

                    <strong>
                        Date:
                    </strong>

                    ${appointment.appointment_date}

                    <br>

                    <strong>
                        Time:
                    </strong>

                    ${appointment.appointment_time}

                    <br>

                    <strong>
                        Reason:
                    </strong>

                    ${appointment.reason}

                </div>


                <div class="admin-actions">

                    ${
                        appointment.status ===
                        "Pending"

                        ? `

                            <button
                                class="approve-btn"
                                onclick="updateAppointmentStatus('${appointment.id}', 'Approved')">

                                Approve

                            </button>

                            <button
                                class="reject-btn"
                                onclick="updateAppointmentStatus('${appointment.id}', 'Rejected')">

                                Reject

                            </button>

                        `

                        : ""
                    }


                    ${
                        appointment.status ===
                        "Approved"

                        ? `

                            <button
                                class="complete-btn"
                                onclick="updateAppointmentStatus('${appointment.id}', 'Completed')">

                                Complete

                            </button>

                        `

                        : ""
                    }

                </div>

            `;


            adminAppointments.appendChild(
                card
            );

        }
    );

}


// ============================================================
// UPDATE APPOINTMENT STATUS
// ============================================================

async function updateAppointmentStatus(
    appointmentId,
    newStatus
) {

    if (!supabaseClient) {

        return;

    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("appointments")
                .update({

                    status:
                        newStatus

                })
                .eq(
                    "id",
                    appointmentId
                );


        if (error) {

            console.error(
                "Status update error:",
                error
            );

            alert(
                "Unable to update appointment."
            );

            return;

        }


        loadAdminDashboard();

    }
    catch (error) {

        console.error(
            "Unexpected status error:",
            error
        );

        alert(
            "Something went wrong."
        );

    }

}


window.updateAppointmentStatus =
    updateAppointmentStatus;


if (
    getCurrentPage() ===
    "admin.html"
) {

    loadAdminDashboard();

}


// ============================================================
// HEALTHDESK PWA INSTALL
// ============================================================

let deferredPrompt = null;


const installBtn =
    document.getElementById(
        "installBtn"
    );

const downloadOverlay =
    document.getElementById(
        "downloadOverlay"
    );

const downloadMessage =
    document.getElementById(
        "downloadMessage"
    );

const downloadCountdown =
    document.getElementById(
        "downloadCountdown"
    );

const downloadProgressBar =
    document.getElementById(
        "downloadProgressBar"
    );


// ============================================================
// CHECK INSTALL MODE
// ============================================================

const isStandalone =
    window.matchMedia(
        "(display-mode: standalone)"
    ).matches ||

    window.matchMedia(
        "(display-mode: fullscreen)"
    ).matches ||

    window.navigator.standalone === true;


// ============================================================
// INSTALL BUTTON
// ============================================================

if (installBtn) {

    if (isStandalone) {

        installBtn.style.display =
            "none";

    }
    else {

        installBtn.style.display =
            "block";

    }


    window.addEventListener(
        "beforeinstallprompt",
        function (event) {

            event.preventDefault();

            deferredPrompt =
                event;


            if (!isStandalone) {

                installBtn.style.display =
                    "block";

            }

        }
    );


    installBtn.addEventListener(
        "click",
        function () {

            startHealthDeskDownload();

        }
    );

}


// ============================================================
// START INSTALLATION
// ============================================================

function startHealthDeskDownload() {

    if (!downloadOverlay) {

        openInstallPrompt();

        return;

    }


    downloadOverlay.classList.add(
        "show"
    );


    let secondsLeft = 5;


    if (downloadCountdown) {

        downloadCountdown.textContent =
            "5 seconds";

    }


    if (downloadMessage) {

        downloadMessage.textContent =
            "Preparing HealthDesk for installation...";

    }


    if (downloadProgressBar) {

        downloadProgressBar.style.width =
            "0%";

    }


    const downloadTimer =
        setInterval(
            async function () {

                secondsLeft--;


                const progress =
                    (
                        (5 - secondsLeft) /
                        5
                    ) *
                    100;


                if (downloadCountdown) {

                    downloadCountdown.textContent =
                        secondsLeft +
                        (
                            secondsLeft === 1
                                ? " second"
                                : " seconds"
                        );

                }


                if (downloadProgressBar) {

                    downloadProgressBar.style.width =
                        progress +
                        "%";

                }


                if (
                    secondsLeft <=
                    0
                ) {

                    clearInterval(
                        downloadTimer
                    );


                    if (downloadProgressBar) {

                        downloadProgressBar.style.width =
                            "100%";

                    }


                    if (downloadMessage) {

                        downloadMessage.textContent =
                            "Opening installation...";

                    }


                    await openInstallPrompt();

                }

            },
            1000
        );

}


// ============================================================
// OPEN INSTALL PROMPT
// ============================================================

async function openInstallPrompt() {

    if (deferredPrompt) {

        try {

            deferredPrompt.prompt();


            const {
                outcome
            } =
                await deferredPrompt.userChoice;


            console.log(
                "Install result:",
                outcome
            );


            deferredPrompt =
                null;

        }
        catch (error) {

            console.error(
                "Installation error:",
                error
            );

        }


        hideDownloadOverlay();

        return;

    }


    const isIOS =
        /iphone|ipad|ipod/i.test(
            navigator.userAgent
        );


    if (isIOS) {

        alert(
            "To install HealthDesk on your iPhone or iPad:\n\n" +
            "1. Tap the Share button in Safari.\n" +
            "2. Select 'Add to Home Screen'.\n" +
            "3. Tap 'Add'."
        );

    }
    else {

        alert(
            "Open your browser menu and select 'Install App' or 'Add to Home Screen'."
        );

    }


    hideDownloadOverlay();

}


// ============================================================
// HIDE DOWNLOAD OVERLAY
// ============================================================

function hideDownloadOverlay() {

    if (downloadOverlay) {

        downloadOverlay.classList.remove(
            "show"
        );

    }

}


// ============================================================
// APP INSTALLED
// ============================================================

window.addEventListener(
    "appinstalled",
    function () {

        console.log(
            "HealthDesk has been installed!"
        );


        hideDownloadOverlay();


        if (installBtn) {

            installBtn.style.display =
                "none";

        }

    }
);


// ============================================================
// SUPABASE AUTH STATE
// ============================================================

if (supabaseClient) {

    supabaseClient.auth.onAuthStateChange(
        function (
            event,
            session
        ) {

            console.log(
                "Supabase auth event:",
                event
            );

        }
    );

}
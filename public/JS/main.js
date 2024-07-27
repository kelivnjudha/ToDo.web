document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById('main-header__menu-click'); // <a> tags


    const menuSlide = document.getElementById('home-main__menu-slide'); // <div> menuslide
    const menuSlideHeader = document.getElementById('home-main__menu-slide-header'); // <h2> menuslide

    
    // MENU SLIDE ADD ICON CLICK EVENTLISTENER
    const buttons = document.querySelectorAll('.home-main__menu-item-container');

    menuIcon.addEventListener('click', (event) => {
        event.preventDefault();
        shadowUp(menuSlide);
        menuSlideHeaderColor(menuSlideHeader);
        buttons.forEach(button => {
            if (button.style.display === 'flex') {
                button.style.display = 'none';
            } else {
                button.style.display = 'flex';
            }
        })
    });

    // MENU SLIDE ADD HOVER EVENTLISTENER

    menuSlide.addEventListener("mouseover", () => {
        shadowUpHover(menuSlide);
        menuSlideHeaderColorHoverOn(menuSlideHeader);
        buttons.forEach(button => {
            button.style.display = 'flex';
        })
    });

    menuSlide.addEventListener("mouseout", () => {
        shadowDownHover(menuSlide);
        menuSlideHeaderColorHoverOut(menuSlideHeader);
        buttons.forEach(button => {
            button.style.display = 'none';
        })
    })


    // MENU SLIDE EFFECTS SRART

    const shadowUp = (domElement) => {

        let relocate = domElement.style.transform === "translateY(-10px)";

        if(relocate){
            domElement.style.transform = "translateY(0px)";
            domElement.style.boxShadow = "none";
        }else{    
            domElement.style.transform = "translateY(-10px)";
            domElement.style.boxShadow = '0px 10px 20px 2px rgba(0, 0, 0, 0.25)';
        };
    };

    const shadowUpHover = (domElement) => {
        domElement.style.transform = "translateY(-10px)";
        domElement.style.boxShadow = '0px 10px 20px 2px rgba(0, 0, 0, 0.25)';
    };

    const shadowDownHover = (domElement) => {
        domElement.style.transform = "translateY(0px)";
        domElement.style.boxShadow = "none";
    };


    const menuSlideHeaderColor = (domElement) => {
        if (domElement.style.display === 'flex') {
            domElement.style.display = 'none';
            domElement.style.visibility = 'hidden';
            domElement.style.opacity = 0;
        } else {
            domElement.style.display = 'flex';
            domElement.style.visibility = 'visible';
            domElement.style.opacity = 1;
        };
    };

    const menuSlideHeaderColorHoverOn = (domElement) => {
        domElement.style.display = 'flex';
        domElement.style.visibility = 'visible';
        domElement.style.opacity = 1;
    };

    const menuSlideHeaderColorHoverOut = (domElement) => {
        domElement.style.display = 'none';
        domElement.style.visibility = 'hidden';
        domElement.style.opacity = 0;
    };


    // MENU SLIDE EFFECT END


    // PROFILE SLIDE EFFECT START
    const ProfileButtons = document.querySelectorAll('.home-main__profile-slide-button-container');
    const profile = document.getElementById('profile__click'); // <a> tags
    const profileSlide = document.getElementById('home-main__profile-slide'); // <div> profile slide
    const profileSlideHeader = document.getElementById('home-main__profile-slide-header')

    profile.addEventListener("click", (event) => {
        event.preventDefault();
        shadowSinkIn(profileSlide);
        profileSlideHeaderColor(profileSlideHeader);
        ProfileButtons.forEach(button => {
            if (button.style.display === 'flex') {
                button.style.display = 'none';
            } else {
                button.style.display = 'flex';
            };
        })
    })

    // EFfects FUNCTIONs
    const shadowSinkIn = (domElement) => {
        let relocate = domElement.style.boxShadow === "inset 0px 10px 20px 2px rgba(0, 0, 0, 0.25)";
        if(relocate){
            domElement.style.transform = "translateY(0px)";
            domElement.style.boxShadow = "none";
        }else{
            domElement.style.transform = "translateY(5px)";
            domElement.style.boxShadow = "inset 0px 10px 20px 2px rgba(0, 0, 0, 0.25)";
        }
    }

    const shadowSinkInHover = (domElement) => {
        domElement.style.transform = "translateY(5px)";
        domElement.style.boxShadow = "inset 0px 10px 20px 2px rgba(0, 0, 0, 0.25)";
    };

    const shadowSinkInHoverRelocate = (domElement) => {
        domElement.style.transform = "translateY(0px)";
        domElement.style.boxShadow = "none";
    };

    // HOVER event
    profileSlide.addEventListener("mouseover", () => {
        shadowSinkInHover(profileSlide);
        profileSlideHeaderColorHoverOn(profileSlideHeader);
        ProfileButtons.forEach(button => {
            button.style.display = 'flex';
        })
    });

    // Hover Event
    profileSlide.addEventListener("mouseout", () => {
        shadowSinkInHoverRelocate(profileSlide)
        profileSlideHeaderColorHoverOut(profileSlideHeader);
        ProfileButtons.forEach(button => {
            button.style.display = 'none';
        })
    })


    const profileSlideHeaderColor = (domElement) => {
        if (domElement.style.display === 'flex') {
            domElement.style.display = 'none';
            domElement.style.visibility = 'hidden';
            domElement.style.opacity = 0;
        } else {
            domElement.style.display = 'flex';
            domElement.style.visibility = 'visible';
            domElement.style.opacity = 1;
        };
    };

    const profileSlideHeaderColorHoverOn = (domElement) => {
        domElement.style.display = 'flex';
        domElement.style.visibility = 'visible';
        domElement.style.opacity = 1;
    };

    const profileSlideHeaderColorHoverOut = (domElement) => {
        domElement.style.display = 'none';
        domElement.style.visibility = 'hidden';
        domElement.style.opacity = 0;
    };


    // Profile SLIDE BUTTONS EFFECTS


    const ProfileButtonAction = (domElement) => {
        
    };

    // SIGN UP FUNCTIONS //

    

    function togglePasswordVisibility(id) {
        const passwordField = document.getElementById(id);
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
        } else {
            passwordField.type = 'password';
        }
    }
})
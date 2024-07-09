import { useEffect, useState } from 'react';

export default function FacebookLoginApp() {
    const [pages, setPages] = useState([]);
    const [selectedPageToken, setSelectedPageToken] = useState(null);

    useEffect(() => {
        // Incluir el SDK de Facebook
        window.fbAsyncInit = function() {
            window.FB.init({
                appId      : '3176667395950990', // Reemplaza con tu App ID
                cookie     : true,
                xfbml      : true,
                version    : 'v18.0'
            });

            window.FB.AppEvents.logPageView();

            // Verificar el estado de inicio de sesión cuando el SDK se haya inicializado
            window.FB.getLoginStatus(function(response) {
                statusChangeCallback(response);
            });
        };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }, []);

    const checkLoginState = () => {
        window.FB.getLoginStatus(function(response) {
            console.log('Check Login State:', response);
            statusChangeCallback(response);
        });
    };

    const statusChangeCallback = (response) => {
        if (response.status === 'connected') {
            fetchPages(response.authResponse.accessToken);
        } else {
            window.FB.login(function(response) {
                if (response.authResponse) {
                    fetchPages(response.authResponse.accessToken);
                }
            }, {scope: 'pages_show_list,pages_read_engagement,pages_manage_metadata,pages_read_user_content,pages_manage_ads'});
        }
    };

    const fetchPages = (userAccessToken) => {
        window.FB.api('/me/accounts', function(response) {
            if (response && !response.error) {
                setPages(response.data);
            }
        });
    };

    const selectPage = (pageAccessToken) => {
        console.log('Selected Page Access Token:', pageAccessToken);
        getLongLivedToken(pageAccessToken);
    };

    const getLongLivedToken = (pageAccessToken) => {
        const clientId = '3176667395950990';
        const clientSecret = 'dccceb998b6e0694a893f2d78469e2e7';

        const url = `https://graph.facebook.com/v12.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${pageAccessToken}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Long-lived Page Access Token:', data.access_token);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        // <div className="d-flex justify-content-center align-items-center ">
            <div className='w-100'>
                <button className="button-bm w-100 mt-3" onClick={checkLoginState}>
                    Inicia sesión con Facebook
                </button>
                <div id="pages" className="mt-1">
                    {pages.map(page => (
                        console.log(page),
                        <div key={page.id} onClick={() => selectPage(page.access_token)}>
                            {page.name}
                        </div>
                    ))}
                </div>
            </div>
        // </div>
    );
};
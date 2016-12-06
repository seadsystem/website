

$(document).ready(function() {
            $("#promo-video").hide(); // Initially hide the video player when the page loads

            //Auto play video on click
            $('#video-btn').on('click', function(){
                player.playVideo();
            });


            //Scroll Position detection function
            var options = [
                {selector: '#PF_row_one', offset: 1200, callback: function() {
                    $('#PF_row_one').addClass('animated fadeInUp');
                    //fade_first_div();
                } },
                {selector: '#PF_row_two', offset:200, callback: function(){
                    $('#PF_row_two').addClass('animated fadeInUp');
                }},
                {selector: '#PF_row_three', offset:200, callback: function() {
                    $('#PF_row_three').addClass('animated fadeInUp')
                }}
                ];
                Materialize.scrollFire(options);
        });

        function show_video() {
            $("#video-btn").hide();
            $("#promo-video").show();
        }

        $('.smooth').on('click', function() {
        $.smoothScroll({
            scrollElement: $('body'),
            scrollTarget: '#' + this.id
        });

        return false;
    });



         // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('promo-video', {
          height: '480',
          width: '720',
          videoId: 'HRURIUm0UTs',
          events: {
            //'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    Player looks for when the video has ended and calls the stopVideo() Function

      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.ENDED) {
            stopVideo()
        }
      }
      function stopVideo() {
        player.stopVideo();
          $("#promo-video").hide();
      }

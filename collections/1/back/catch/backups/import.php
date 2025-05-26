<?php

    mdEvents::fn_catch('dh.backups.import', function(object $import)
    {
        collections::fn_backups_import($import);
    });
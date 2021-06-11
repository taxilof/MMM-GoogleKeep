#!/usr/bin/python
# coding: utf8

import json
import sys
import gkeepapi
from operator import attrgetter



keep = gkeepapi.Keep()

cfg_username = ''
cfg_password = ''
cfg_note_id = ''


def to_node(type, message):
    try:
        print(json.dumps({type: message}))
    except Exception:
        pass

    sys.stdout.flush()


if __name__ == '__main__':
    try:
        config_json_str = sys.argv[1]
        config_json = json.loads(config_json_str)
        cfg_username = config_json['username']
        cfg_password = config_json['password']
        cfg_note_id = config_json['noteId']
        cfg_max_lines = config_json['maxLines']
        #to_node("debug", 'user: ' + cfg_username + ' pw len: ' + str(len(cfg_password)) + ' note id: ' + cfg_note_id)
    except Exception:
        to_node("debug", 'could not parse config')

    
    #to_node("debug", 'Google Keep script started')
    #to_node("debug", sys.argv)

    success = keep.login(cfg_username, cfg_password)
    gnote = keep.get(cfg_note_id)

    text = gnote.text
    lines = text.split('\n')
    lines = lines[:cfg_max_lines]
    text = '\n'.join(lines)
    
    to_node("note_text", text)

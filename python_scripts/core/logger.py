import logging


class Logger:
    level = {
        'debug': logging.DEBUG,
        'info': logging.INFO,
        'warning': logging.WARNING,
        'error': logging.ERROR,
        'crit': logging.CRITICAL
    }

    def __init__(self, name: str, level: str):
        self.log = logging.getLogger(name)
        log_level = self.level.get(level, 'info')

        console_handler = logging.StreamHandler()
        console_handler.setLevel(log_level)
        console_handler.setFormatter(
            logging.Formatter('%(asctime)s - %(levelname)s: %(message)s'))

        self.log.setLevel(log_level)
        self.log.addHandler(console_handler)

import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))
from serve import load_archive_root, xdg_config_path


def test_xdg_config_path_default(tmp_path, monkeypatch):
    monkeypatch.delenv("XDG_CONFIG_HOME", raising=False)
    monkeypatch.setenv("HOME", str(tmp_path))
    path = xdg_config_path()
    assert path == tmp_path / ".config" / "android-archivist" / "config.json"


def test_xdg_config_path_custom(tmp_path, monkeypatch):
    monkeypatch.setenv("XDG_CONFIG_HOME", str(tmp_path / "custom"))
    path = xdg_config_path()
    assert path == tmp_path / "custom" / "android-archivist" / "config.json"


def test_load_archive_root_success(tmp_path, monkeypatch):
    config_dir = tmp_path / "config" / "android-archivist"
    config_dir.mkdir(parents=True)
    config_file = config_dir / "config.json"
    config_file.write_text(json.dumps({"archiveRoot": str(tmp_path / "archives")}))

    monkeypatch.setenv("XDG_CONFIG_HOME", str(tmp_path / "config"))
    result = load_archive_root()
    assert result == str(tmp_path / "archives")


def test_load_archive_root_missing_config(tmp_path, monkeypatch):
    monkeypatch.setenv("XDG_CONFIG_HOME", str(tmp_path / "empty"))
    with pytest.raises(SystemExit):
        load_archive_root()


def test_load_archive_root_empty_root(tmp_path, monkeypatch):
    config_dir = tmp_path / "config" / "android-archivist"
    config_dir.mkdir(parents=True)
    (config_dir / "config.json").write_text(json.dumps({"archiveRoot": ""}))

    monkeypatch.setenv("XDG_CONFIG_HOME", str(tmp_path / "config"))
    with pytest.raises(SystemExit):
        load_archive_root()
